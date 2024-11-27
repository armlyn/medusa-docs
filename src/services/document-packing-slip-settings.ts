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
import { DocumentPackingSlipSettings } from "../models/document-packing-slip-settings";
import { MedusaError } from "@medusajs/utils"
import { PackingSlipTemplateKind } from "./types/template-kind";
import { User } from "../models/user";

export default class DocumentPackingSlipSettingsService extends TransactionBaseService {
  private readonly loggedInUser_: User | null

  constructor(
    container,
  ) {
    super(container)

    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  private copySettingsIfPossible(newSettings: DocumentPackingSlipSettings, lastSettings?: DocumentPackingSlipSettings) {
    if (lastSettings) {
      newSettings.forced_number = lastSettings.forced_number;
      newSettings.number_format = lastSettings.number_format;
      newSettings.template = lastSettings.template;
    }
  }

  async getPackingSlipForcedNumber() : Promise<string | undefined> {
    const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();
    if (documentPackingSlipSettings && documentPackingSlipSettings.forced_number) {
      const nextNumber: string = documentPackingSlipSettings.forced_number.toString();
      return nextNumber;
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings() : Promise<DocumentPackingSlipSettings> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();
    
    if (!documentPackingSlipSettings) {
      const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
      newDocumentPackingSlipSettings.forced_number = undefined;
      newDocumentPackingSlipSettings.store_id = this.loggedInUser_.store_id;
      
      return await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    }

    documentPackingSlipSettings.forced_number = undefined;
    documentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

    const result = await documentPackingSlipSettingsRepository.save(documentPackingSlipSettings);
    return result;
  }

  async getLastDocumentPackingSlipSettings() : Promise<DocumentPackingSlipSettings | undefined> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const documentPackingSlipSettings: DocumentPackingSlipSettings | null = await documentPackingSlipSettingsRepository.createQueryBuilder('documentPackingSlipSettings')
      .orderBy('documentPackingSlipSettings.created_at', 'DESC')
      .getOne()

    if (documentPackingSlipSettings === null) {
      return undefined;
    }

    return documentPackingSlipSettings;
  }

  async getDocumentPackingSlipSettings(): Promise<DocumentPackingSlipSettings | undefined> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings: DocumentPackingSlipSettings | null = await documentPackingSlipSettingsRepository.createQueryBuilder('documentPackingSlipSettings')
      .where("documentPackingSlipSettings.store_id = :storeId", { storeId: this.loggedInUser_.store_id })
      .orderBy('documentPackingSlipSettings.created_at', 'DESC')
      .getOne()

    if (lastDocumentPackingSlipSettings === null) {
      return undefined;
    }

    return lastDocumentPackingSlipSettings;
  }

  async getPackingSlipTemplate() : Promise<string | undefined> {
    const lastDocumentPackingSlipSettings = await this.getDocumentPackingSlipSettings();
    if (lastDocumentPackingSlipSettings) {
      return lastDocumentPackingSlipSettings.template;
    }
    return undefined;
  }

  async updatePackingSlipForcedNumber(forcedNumber: string | undefined) : Promise<DocumentPackingSlipSettings | undefined> {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
      const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();

      if (!documentPackingSlipSettings) {
        const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
        newDocumentPackingSlipSettings.forced_number = parseInt(forcedNumber);
        newDocumentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

        return await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
      }
      
      documentPackingSlipSettings.forced_number = parseInt(forcedNumber);
      documentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

      const result = await documentPackingSlipSettingsRepository.save(documentPackingSlipSettings);

      return result;
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to set proper number'
      );
    }
  }

  async updatePackingSlipTemplate(packingSlipTemplate: PackingSlipTemplateKind | undefined) : Promise<DocumentPackingSlipSettings | undefined> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();

    if (!documentPackingSlipSettings) {
      const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
      newDocumentPackingSlipSettings.template = packingSlipTemplate;
      newDocumentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

      return await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    }

    documentPackingSlipSettings.template = packingSlipTemplate;
    documentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

    const result = await documentPackingSlipSettingsRepository.save(documentPackingSlipSettings);

    return result;
  }

  async updateFormatNumber(newFormatNumber: string) : Promise<DocumentPackingSlipSettings | undefined> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();

    if (!documentPackingSlipSettings) {
      const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
      newDocumentPackingSlipSettings.number_format = newFormatNumber;
      newDocumentPackingSlipSettings.store_id = this.loggedInUser_.store_id;

      return await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    }

    documentPackingSlipSettings.number_format = newFormatNumber;
    documentPackingSlipSettings.store_id = this.loggedInUser_.store_id;
    const result = await documentPackingSlipSettingsRepository.save(documentPackingSlipSettings);

    return result;
  }

  async updateSettings(newFormatNumber?: string, forcedNumber?: string, packingSlipTemplate?: PackingSlipTemplateKind) : Promise<DocumentPackingSlipSettings | undefined> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const documentPackingSlipSettings = await this.getDocumentPackingSlipSettings();
    
    if (!documentPackingSlipSettings) {
      const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
      newDocumentPackingSlipSettings.number_format = newFormatNumber;
      newDocumentPackingSlipSettings.template = packingSlipTemplate;
      newDocumentPackingSlipSettings.store_id = this.loggedInUser_.store_id
      if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
        newDocumentPackingSlipSettings.forced_number = parseInt(forcedNumber);
      }
      
      return await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    }
    
    if (newFormatNumber) {
      documentPackingSlipSettings.number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      documentPackingSlipSettings.forced_number = parseInt(forcedNumber);
    }
    if (packingSlipTemplate) {
      documentPackingSlipSettings.template = packingSlipTemplate;
    }

    if (this.loggedInUser_.store_id) {
      documentPackingSlipSettings.store_id = this.loggedInUser_.store_id
    }

    const result = await documentPackingSlipSettingsRepository.save(documentPackingSlipSettings);
    return result;
  }
}