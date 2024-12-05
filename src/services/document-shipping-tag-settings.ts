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

import { TransactionBaseService } from "@medusajs/medusa"
import { DocumentShippingTagSettings } from "../models/document-shipping-tag-settings";
import { MedusaError } from "@medusajs/utils"
import { ShippingTagTemplateKind } from "./types/template-kind";
import { User } from "../models/user";

export default class DocumentShippingTagSettingsService extends TransactionBaseService {
  private readonly loggedInUser_: User | null

  constructor(
    container,
  ) {
    super(container)

    try {
      this.loggedInUser_ = container.authenticatedUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  private copySettingsIfPossible(newSettings: DocumentShippingTagSettings, lastSettings?: DocumentShippingTagSettings) {
    if (lastSettings) {
      newSettings.forced_number = lastSettings.forced_number;
      newSettings.number_format = lastSettings.number_format;
      newSettings.template = lastSettings.template;
    }
  }

  async getShippingTagForcedNumber() : Promise<string | undefined> {
    const documentShippingTagSettings = await this.getDocumentShippingTagSettings();
    if (documentShippingTagSettings && documentShippingTagSettings.forced_number) {
      const nextNumber: string = documentShippingTagSettings.forced_number.toString();
      return nextNumber;
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings() : Promise<DocumentShippingTagSettings> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings = await this.getDocumentShippingTagSettings();
    
    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(DocumentShippingTagSettings);
      newDocumentShippingTagSettings.forced_number = undefined;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;
      
      return await documentShippingTagSettingsRepository.save(newDocumentShippingTagSettings);
    }

    documentShippingTagSettings.forced_number = undefined;
    documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

    const result = await documentShippingTagSettingsRepository.save(documentShippingTagSettings);
    return result;
  }

  async getLastDocumentShippingTagSettings() : Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings: DocumentShippingTagSettings | null = await documentShippingTagSettingsRepository.createQueryBuilder('documentShippingTagSettings')
      .orderBy('documentShippingTagSettings.created_at', 'DESC')
      .getOne()

    if (documentShippingTagSettings === null) {
      return undefined;
    }

    return documentShippingTagSettings;
  }

  async getDocumentShippingTagSettings(): Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const lastDocumentShippingTagSettings: DocumentShippingTagSettings | null = await documentShippingTagSettingsRepository.createQueryBuilder('documentShippingTagSettings')
      .where("documentShippingTagSettings.store_id = :storeId", { storeId: this.loggedInUser_.store_id })
      .orderBy('documentShippingTagSettings.created_at', 'DESC')
      .getOne()

    if (lastDocumentShippingTagSettings === null) {
      return undefined;
    }

    return lastDocumentShippingTagSettings;
  }

  async getShippingTagTemplate() : Promise<string | undefined> {
    const lastDocumentShippingTagSettings = await this.getDocumentShippingTagSettings();
    if (lastDocumentShippingTagSettings) {
      return lastDocumentShippingTagSettings.template;
    }
    return undefined;
  }

  async updateShippingTagForcedNumber(forcedNumber: string | undefined) : Promise<DocumentShippingTagSettings | undefined> {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
      const documentShippingTagSettings = await this.getDocumentShippingTagSettings();

      if (!documentShippingTagSettings) {
        const newDocumentShippingTagSettings = this.activeManager_.create(DocumentShippingTagSettings);
        newDocumentShippingTagSettings.forced_number = parseInt(forcedNumber);
        newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

        return await documentShippingTagSettingsRepository.save(newDocumentShippingTagSettings);
      }
      
      documentShippingTagSettings.forced_number = parseInt(forcedNumber);
      documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      const result = await documentShippingTagSettingsRepository.save(documentShippingTagSettings);

      return result;
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to set proper number'
      );
    }
  }

  async updateShippingTagTemplate(shippingTagTemplate: ShippingTagTemplateKind | undefined) : Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings = await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(DocumentShippingTagSettings);
      newDocumentShippingTagSettings.template = shippingTagTemplate;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      return await documentShippingTagSettingsRepository.save(newDocumentShippingTagSettings);
    }

    documentShippingTagSettings.template = shippingTagTemplate;
    documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

    const result = await documentShippingTagSettingsRepository.save(documentShippingTagSettings);

    return result;
  }

  async updateFormatNumber(newFormatNumber: string) : Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings = await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(DocumentShippingTagSettings);
      newDocumentShippingTagSettings.number_format = newFormatNumber;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      return await documentShippingTagSettingsRepository.save(newDocumentShippingTagSettings);
    }

    documentShippingTagSettings.number_format = newFormatNumber;
    documentShippingTagSettings.store_id = this.loggedInUser_.store_id;
    const result = await documentShippingTagSettingsRepository.save(documentShippingTagSettings);

    return result;
  }

  async updateSettings(newFormatNumber?: string, forcedNumber?: string, shippingTagTemplate?: ShippingTagTemplateKind) : Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository = this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings = await this.getDocumentShippingTagSettings();
    
    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(DocumentShippingTagSettings);
      newDocumentShippingTagSettings.number_format = newFormatNumber;
      newDocumentShippingTagSettings.template = shippingTagTemplate;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id
      if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
        newDocumentShippingTagSettings.forced_number = parseInt(forcedNumber);
      }
      
      return await documentShippingTagSettingsRepository.save(newDocumentShippingTagSettings);
    }
    
    if (newFormatNumber) {
      documentShippingTagSettings.number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      documentShippingTagSettings.forced_number = parseInt(forcedNumber);
    }
    if (shippingTagTemplate) {
      documentShippingTagSettings.template = shippingTagTemplate;
    }

    if (this.loggedInUser_.store_id) {
      documentShippingTagSettings.store_id = this.loggedInUser_.store_id
    }

    const result = await documentShippingTagSettingsRepository.save(documentShippingTagSettings);
    return result;
  }
}