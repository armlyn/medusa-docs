import { TransactionBaseService } from "@medusajs/medusa";
import { DocumentShippingTagSettings } from "../models/document-shipping-tag-settings";
import { MedusaError } from "@medusajs/utils";
import { ShippingTagTemplateKind } from "./types/template-kind";
import { User } from "../models/user";

export default class DocumentShippingTagSettingsService extends TransactionBaseService {
  private readonly loggedInUser_: User | null;

  constructor(container) {
    super(container);

    try {
      this.loggedInUser_ = container.authenticatedUser;
    } catch (e) {
      // evitar errores cuando el backend se ejecuta por primera vez
    }
  }

  private copySettingsIfPossible(
    newSettings: DocumentShippingTagSettings,
    lastSettings?: DocumentShippingTagSettings
  ) {
    if (lastSettings) {
      newSettings.shipping_tag_forced_number =
        lastSettings.shipping_tag_forced_number;
      newSettings.shipping_tag_number_format =
        lastSettings.shipping_tag_number_format;
      newSettings.shipping_tag_template = lastSettings.shipping_tag_template;
    }
  }

  async getShippingTagForcedNumber(): Promise<string | undefined> {
    const lastDocumentShippingTagSettings =
      await this.getDocumentShippingTagSettings();
    if (
      lastDocumentShippingTagSettings &&
      lastDocumentShippingTagSettings.shipping_tag_forced_number
    ) {
      return lastDocumentShippingTagSettings.shipping_tag_forced_number.toString();
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings(): Promise<DocumentShippingTagSettings> {
    const documentShippingTagSettingsRepository =
      this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings =
      await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(
        DocumentShippingTagSettings
      );
      newDocumentShippingTagSettings.shipping_tag_forced_number = undefined;

      return await documentShippingTagSettingsRepository.save(
        newDocumentShippingTagSettings
      );
    }

    documentShippingTagSettings.shipping_tag_forced_number = undefined;

    return await documentShippingTagSettingsRepository.save(
      documentShippingTagSettings
    );
  }

  async getDocumentShippingTagSettings(): Promise<
    DocumentShippingTagSettings | undefined
  > {
    const documentShippingTagSettingsRepository =
      this.activeManager_.getRepository(DocumentShippingTagSettings);
    const lastDocumentShippingTagSettings: DocumentShippingTagSettings | null =
      await documentShippingTagSettingsRepository
        .createQueryBuilder("documentShippingTagSettings")
        .where("documentShippingTagSettings.store_id = :storeId", {
          storeId: this.loggedInUser_.store_id,
        })
        .orderBy("documentShippingTagSettings.created_at", "DESC")
        .getOne();

    return lastDocumentShippingTagSettings || undefined;
  }

  async getShippingTagTemplate(): Promise<string | undefined> {
    const documentShippingTagSettings =
      await this.getDocumentShippingTagSettings();
    return documentShippingTagSettings?.shipping_tag_template;
  }

  async updateShippingTagForcedNumber(
    forcedNumber: string | undefined
  ): Promise<DocumentShippingTagSettings | undefined> {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentShippingTagSettingsRepository =
        this.activeManager_.getRepository(DocumentShippingTagSettings);
      const documentShippingTagSettings =
        await this.getDocumentShippingTagSettings();

      if (!documentShippingTagSettings) {
        const newDocumentShippingTagSettings = this.activeManager_.create(
          DocumentShippingTagSettings
        );
        newDocumentShippingTagSettings.shipping_tag_forced_number =
          parseInt(forcedNumber);
        newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

        return await documentShippingTagSettingsRepository.save(
          newDocumentShippingTagSettings
        );
      }

      documentShippingTagSettings.shipping_tag_forced_number =
        parseInt(forcedNumber);
      documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      return await documentShippingTagSettingsRepository.save(
        documentShippingTagSettings
      );
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Debes establecer un número válido"
      );
    }
  }

  async updateShippingTagTemplate(
    shippingTagTemplate: ShippingTagTemplateKind | undefined
  ): Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository =
      this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings =
      await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(
        DocumentShippingTagSettings
      );
      newDocumentShippingTagSettings.shipping_tag_template =
        shippingTagTemplate;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      return await documentShippingTagSettingsRepository.save(
        newDocumentShippingTagSettings
      );
    }
    documentShippingTagSettings.shipping_tag_template = shippingTagTemplate;
    documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

    return await documentShippingTagSettingsRepository.save(
      documentShippingTagSettings
    );
  }

  async updateFormatNumber(
    newFormatNumber: string | undefined
  ): Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository =
      this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings =
      await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(
        DocumentShippingTagSettings
      );
      newDocumentShippingTagSettings.shipping_tag_number_format =
        newFormatNumber;
      newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;

      return await documentShippingTagSettingsRepository.save(
        newDocumentShippingTagSettings
      );
    }

    documentShippingTagSettings.shipping_tag_number_format = newFormatNumber;
    documentShippingTagSettings.store_id = this.loggedInUser_.store_id;

    return await documentShippingTagSettingsRepository.save(
      documentShippingTagSettings
    );
  }

  async updateSettings(
    newFormatNumber?: string,
    forcedNumber?: string,
    shippingTagTemplate?: ShippingTagTemplateKind
  ): Promise<DocumentShippingTagSettings | undefined> {
    const documentShippingTagSettingsRepository =
      this.activeManager_.getRepository(DocumentShippingTagSettings);
    const documentShippingTagSettings =
      await this.getDocumentShippingTagSettings();

    if (!documentShippingTagSettings) {
      const newDocumentShippingTagSettings = this.activeManager_.create(
        DocumentShippingTagSettings
      );
      newDocumentShippingTagSettings.shipping_tag_number_format =
        newFormatNumber;
      newDocumentShippingTagSettings.shipping_tag_template =
        shippingTagTemplate;
      newDocumentShippingTagSettings.shipping_tag_forced_number =
        forcedNumber !== undefined && !isNaN(Number(forcedNumber))
          ? parseInt(forcedNumber)
          : undefined;
      if (this.loggedInUser_.store_id) {
        newDocumentShippingTagSettings.store_id = this.loggedInUser_.store_id;
      }

      return await documentShippingTagSettingsRepository.save(
        newDocumentShippingTagSettings
      );
    }

    if (newFormatNumber) {
      documentShippingTagSettings.shipping_tag_number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      documentShippingTagSettings.shipping_tag_forced_number =
        parseInt(forcedNumber);
    }
    if (shippingTagTemplate) {
      documentShippingTagSettings.shipping_tag_template = shippingTagTemplate;
    }

    if (this.loggedInUser_.store_id) {
      documentShippingTagSettings.store_id = this.loggedInUser_.store_id;
    }

    return await documentShippingTagSettingsRepository.save(
      documentShippingTagSettings
    );
  }
}
