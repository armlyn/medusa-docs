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
import { DocumentInvoiceSettings } from "../models/document-invoice-settings";
import { MedusaError } from "@medusajs/utils"
import { InvoiceTemplateKind } from "./types/template-kind";
import { User } from "../models/user";

export default class DocumentInvoiceSettingsService extends TransactionBaseService {
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

  private copySettingsIfPossible(newSettings: DocumentInvoiceSettings, lastSettings?: DocumentInvoiceSettings) {
    if (lastSettings) {
      newSettings.invoice_forced_number = lastSettings.invoice_forced_number;
      newSettings.invoice_number_format = lastSettings.invoice_number_format;
      newSettings.invoice_template = lastSettings.invoice_template;
    }
  }

  async getInvoiceForcedNumber() : Promise<string | undefined> {
    const lastDocumentInvoiceSettings = await this.getDocumentInvoiceSettings();
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.invoice_forced_number) {
      const nextNumber: string = lastDocumentInvoiceSettings.invoice_forced_number.toString();
      return nextNumber;
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings() : Promise<DocumentInvoiceSettings> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const documentInvoiceSettings = await this.getDocumentInvoiceSettings();
    
    if (!documentInvoiceSettings) {
      const newDocumentInvoiceSettings = this.activeManager_.create(DocumentInvoiceSettings);
      newDocumentInvoiceSettings.invoice_forced_number = undefined;
      
      return await documentInvoiceSettingsRepository.save(newDocumentInvoiceSettings);
    }

    documentInvoiceSettings.invoice_forced_number = undefined;

    const result = await documentInvoiceSettingsRepository.save(documentInvoiceSettings);
    return result;
  }

  async getLastDocumentInvoiceSettings() : Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const lastDocumentInvoiceSettings: DocumentInvoiceSettings | null = await documentInvoiceSettingsRepository.createQueryBuilder('documentInvoiceSettings')
      .where("documentInvoiceSettings.store_id = :storeId", { storeId: this.loggedInUser_.store_id })  
      .orderBy('documentInvoiceSettings.created_at', 'DESC')
      .getOne()

    if (lastDocumentInvoiceSettings === null) {
      return undefined;
    }

    return lastDocumentInvoiceSettings;
  }

  async getDocumentInvoiceSettings(): Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const lastDocumentInvoiceSettings: DocumentInvoiceSettings | null = await documentInvoiceSettingsRepository.createQueryBuilder('documentInvoiceSettings')
      .where("documentInvoiceSettings.store_id = :storeId", { storeId: this.loggedInUser_.store_id })
      .orderBy('documentInvoiceSettings.created_at', 'DESC')
      .getOne()

    if (lastDocumentInvoiceSettings === null) {
      return undefined;
    }

    return lastDocumentInvoiceSettings;
  }

  async getInvoiceTemplate() : Promise<string | undefined> {
    const documentInvoiceSettings = await this.getDocumentInvoiceSettings();
    if (documentInvoiceSettings) {
      return documentInvoiceSettings.invoice_template;
    }
    return undefined;
  }

  async updateInvoiceForcedNumber(forcedNumber: string | undefined) : Promise<DocumentInvoiceSettings | undefined> {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
      const documentInvoiceSettings = await this.getDocumentInvoiceSettings();

      if (!documentInvoiceSettings) {
        const newDocumentInvoiceSettings = this.activeManager_.create(DocumentInvoiceSettings);
        newDocumentInvoiceSettings.invoice_forced_number = parseInt(forcedNumber);
        newDocumentInvoiceSettings.store_id = this.loggedInUser_.store_id

        return await documentInvoiceSettingsRepository.save(newDocumentInvoiceSettings);
      }

      documentInvoiceSettings.invoice_forced_number = parseInt(forcedNumber);
      documentInvoiceSettings.store_id = this.loggedInUser_.store_id

      const result = await documentInvoiceSettingsRepository.save(documentInvoiceSettings);

      return result;
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to set proper number'
      );
    }
  }

  async updateInvoiceTemplate(invoiceTemplate: InvoiceTemplateKind | undefined) : Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const documentInvoiceSettings = await this.getDocumentInvoiceSettings();

    if (!documentInvoiceSettings) {
      const newDocumentInvoiceSettings = this.activeManager_.create(DocumentInvoiceSettings);
      newDocumentInvoiceSettings.invoice_template = invoiceTemplate;
      newDocumentInvoiceSettings.store_id = this.loggedInUser_.store_id

      return await documentInvoiceSettingsRepository.save(newDocumentInvoiceSettings);
    }
    documentInvoiceSettings.invoice_template = invoiceTemplate;
    documentInvoiceSettings.store_id = this.loggedInUser_.store_id

    const result = await documentInvoiceSettingsRepository.save(documentInvoiceSettings);

    return result;
  }

  async updateFormatNumber(newFormatNumber: string | undefined) : Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const documentInvoiceSettings = await this.getDocumentInvoiceSettings();

    if (!documentInvoiceSettings) {
      const newDocumentInvoiceSettings = this.activeManager_.create(DocumentInvoiceSettings);
      newDocumentInvoiceSettings.invoice_number_format = newFormatNumber;
      newDocumentInvoiceSettings.store_id = this.loggedInUser_.store_id

      return await documentInvoiceSettingsRepository.save(newDocumentInvoiceSettings);
    }
    
    documentInvoiceSettings.invoice_number_format = newFormatNumber;
    documentInvoiceSettings.store_id = this.loggedInUser_.store_id

    const result = await documentInvoiceSettingsRepository.save(documentInvoiceSettings);

    return result;
  }

  async updateSettings(newFormatNumber?: string, forcedNumber?: string, invoiceTemplate?: InvoiceTemplateKind) : Promise<DocumentInvoiceSettings | undefined> {
    const documentInvoiceSettingsRepository = this.activeManager_.getRepository(DocumentInvoiceSettings);
    const documentInvoiceSettings = await this.getDocumentInvoiceSettings();

    if (!documentInvoiceSettings) {
      const newDocumentInvoiceSettings = this.activeManager_.create(DocumentInvoiceSettings);
      newDocumentInvoiceSettings.invoice_number_format = newFormatNumber
      newDocumentInvoiceSettings.invoice_template = invoiceTemplate
      newDocumentInvoiceSettings.invoice_forced_number = (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) ? parseInt(forcedNumber) : undefined
      if (this.loggedInUser_.store_id) {
        newDocumentInvoiceSettings.store_id = this.loggedInUser_.store_id
      }

      return await documentInvoiceSettingsRepository.save(newDocumentInvoiceSettings);
    }

    if ( newFormatNumber) {
      documentInvoiceSettings.invoice_number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      documentInvoiceSettings.invoice_forced_number = parseInt(forcedNumber);
    }
    if (invoiceTemplate) {
      documentInvoiceSettings.invoice_template = invoiceTemplate;
    }

    if (this.loggedInUser_.store_id) {
      documentInvoiceSettings.store_id = this.loggedInUser_.store_id
    }

    const result = await documentInvoiceSettingsRepository.save(documentInvoiceSettings);

    return result;
  }
}