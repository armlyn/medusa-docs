/*
 * 
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Address, TransactionBaseService, setMetadata } from "@medusajs/medusa"
import { Order, OrderService, } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { ShippingTag } from "../models/shipping-tag";
import { DocumentSettings } from "../models/document-settings";
import { DocumentShippingTagSettings } from "../models/document-shipping-tag-settings";
import { DocumentAddress, ShippingTagResult } from "./types/api";
import { ShippingTagTemplateKind } from "./types/template-kind";
import { generate, validateInputForProvidedKind } from "./generators/shipping-tag-generator";
import DocumentShippingTagSettingsService from "./document-shipping-tag-settings";
import { SHIPPING_TAG_NUMBER_PLACEHOLDER } from "./types/constants";

export default class ShippingTagService extends TransactionBaseService {

  private readonly orderService: OrderService;
  private readonly documentShippingTagSettingsService: DocumentShippingTagSettingsService

  constructor(
    container,
  ) {
    super(container)
    this.orderService = container.orderService;
    this.documentShippingTagSettingsService = container.documentShippingTagSettingsService;
  }

  private calculateFormatNumber(documentShippingTagSettings: DocumentShippingTagSettings) : string | undefined {
    if (documentShippingTagSettings && documentShippingTagSettings.number_format) {
      return documentShippingTagSettings.number_format;
    }

    return undefined;
  }

  private calculateTemplateKind(documentShippingTagSettings: DocumentShippingTagSettings) : ShippingTagTemplateKind {
    if (documentShippingTagSettings && documentShippingTagSettings.template) {
      return documentShippingTagSettings.template as ShippingTagTemplateKind;
    }
    return ShippingTagTemplateKind.BASIC;
  }

  private async getNextNumber() {
    const lastShippingTag: ShippingTag | null = await this.activeManager_
      .getRepository(ShippingTag)
      .createQueryBuilder('packs')
      .orderBy('created_at', 'DESC')
      .getOne()
    if (lastShippingTag !== null && lastShippingTag !== undefined) {
      return (parseInt(lastShippingTag.number) + 1).toString();
    }
    return '1';
  }

  async getLastDocumentSettings() : Promise<DocumentSettings | undefined> {
    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .leftJoinAndSelect("documentSettings.store_address", "store_address")
      .orderBy('documentSettings.created_at', 'DESC')
      .getOne()

    if (lastDocumentSettings === null) {
      return undefined;
    }

    return lastDocumentSettings;
  }

  async getShippingTag(shippingTagId: string, includeBuffer: boolean = false): Promise<ShippingTagResult> {

    if (includeBuffer) {
      const shippingTag: ShippingTag | null = await this.activeManager_
      .getRepository(ShippingTag)
        .createQueryBuilder('shipptag')
      .leftJoinAndSelect("shipptag.document_settings", "document_settings")
      .leftJoinAndSelect("document_settings.store_address", "store_address")
      .leftJoinAndSelect("shipptag.document_shipping_tag_settings", "document_shipping_tag_settings")
      .leftJoinAndSelect("shipptag.order", "order")
      .where("shipptag.id = :shippingTagId", { shippingTagId: shippingTagId })
      .getOne();

      if (shippingTag && shippingTag !== null && shippingTag.document_settings) {
        const order = await this.orderService.retrieveWithTotals(
          shippingTag.order.id,
          {
            relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
          }
        );
        const calculatedTemplateKind = this.calculateTemplateKind(shippingTag.document_shipping_tag_settings);
        const buffer = await generate(calculatedTemplateKind, shippingTag.document_settings, shippingTag, order);
        return {
          shippingTag: shippingTag,
          buffer: buffer
        }
      }
    }

    const shippingTag: ShippingTag | null = await this.activeManager_
      .getRepository(ShippingTag)
      .createQueryBuilder('shipptag')
      .where("shipptag.id = :shippingTagId", { shippingTagId: shippingTagId })
      .getOne();

    if (shippingTag && shippingTag !== null) {
      return {
        shippingTag: shippingTag
      }
    }
    return {
      shippingTag: undefined,
      buffer: undefined
    }
  }

  async create(orderId: string): Promise<ShippingTagResult> { 

    const order = await this.orderService.retrieveWithTotals(
      orderId,
      {
        relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
      }
    );
    if (order) {
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const shippingTagSettings: DocumentShippingTagSettings | undefined = await this.documentShippingTagSettingsService.getLastDocumentShippingTagSettings();
        if (shippingTagSettings) {
          const calculatedTemplateKind = this.calculateTemplateKind(shippingTagSettings);
          const [validationPassed, info] = validateInputForProvidedKind(calculatedTemplateKind, settings);
          if (validationPassed) {
            const nextNumber: string = await this.getNextNumber();
            const newEntry = this.activeManager_.create(ShippingTag);
            newEntry.number = nextNumber;
  
            const shippingTagFormatNumber = this.calculateFormatNumber(shippingTagSettings);
  
            newEntry.display_number = shippingTagFormatNumber ? shippingTagFormatNumber.replace(SHIPPING_TAG_NUMBER_PLACEHOLDER, newEntry.number) : newEntry.number;
            newEntry.order = order;
            newEntry.document_settings = settings;
            newEntry.document_shipping_tag_settings = shippingTagSettings;
  
            const resultInvoice = await this.activeManager_.getRepository(ShippingTag).save(newEntry);
  
            const metaDataUpdate = setMetadata(order, {
              shipping_tag_id: resultInvoice.id
            });
  
            order.metadata = metaDataUpdate;
  
            await this.activeManager_.getRepository(Order).save(order);
  
            const buffer = await generate(calculatedTemplateKind, settings, resultInvoice, order);
  
            return {
              shippingTag: newEntry,
              buffer: buffer
            };
          } else {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              info
            );
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            'Retrieve packing slip settings failed. Please check if they are set - e.g. if you set template or other settings.'
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Retrieve document settings failed. Please check if they are set.'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Cant retrieve order'
      );
    }
  }

  async generatePreview(templateKind: ShippingTagTemplateKind): Promise<ShippingTagResult> {
    const lastOrder = await this.activeManager_.getRepository(Order).find({
      skip: 0,
      take: 1,
      order: { created_at: "DESC"},
    })

    if (lastOrder && lastOrder.length > 0) {
      const lastOrderWithTotals = await this.orderService.retrieveWithTotals(
        lastOrder[0].id,
        {
          relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
        }
      );
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const previewShippingTag = this.activeManager_.create(ShippingTag);
        const nextNumber: string = await this.getNextNumber();
        previewShippingTag.number = nextNumber;
        previewShippingTag.display_number = nextNumber;
        previewShippingTag.created_at = new Date(Date.now());
        const [validationPassed, info] = validateInputForProvidedKind(templateKind, settings);
        if (validationPassed) {
          const buffer = await generate(templateKind, settings, previewShippingTag, lastOrderWithTotals);
          return {
            shippingTag: previewShippingTag,
            buffer: buffer
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            info
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Document settings are not defined'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to have at least one order to see preview'
      );
    }
  }
}