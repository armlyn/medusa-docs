// Implementar el `DocumentShippingTagSettingsService`.
// Crear la función `generateShippingTag` y `validateInputForProvidedKind` en un archivo separado.
// Definir las constantes necesarias como `SHIPPING_TAG_NUMBER_PLACEHOLDER`.

// import { Address, TransactionBaseService, setMetadata } from "@medusajs/medusa";
// import { Order, OrderService } from "@medusajs/medusa";
// import { MedusaError } from "@medusajs/utils";
// import { ShippingTag } from "../models/shipping-tag";
// import { DocumentSettings } from "../models/document-settings";
// import { DocumentShippingTagSettings } from "../models/document-shipping-tag-settings";
// import { DocumentAddress, ShippingTagResult } from "./types/api";
// import { ShippingTagTemplateKind } from "./types/template-kind";
// import {
//   generateShippingTag,
//   validateInputForProvidedKind,
// } from "./generators/shipping-tag-generator";
// import { SHIPPING_TAG_NUMBER_PLACEHOLDER } from "./types/constants";
// import DocumentShippingTagSettingsService from "./document-shipping-tag-settings";
// import { User } from "../models/user";

// export default class ShippingTagService extends TransactionBaseService {
//   private readonly orderService: OrderService;
//   private readonly documentShippingTagSettingsService: DocumentShippingTagSettingsService;
//   private readonly loggedInUser_: User | null;

//   constructor(container) {
//     super(container);
//     this.orderService = container.orderService;
//     this.documentShippingTagSettingsService =
//       container.documentShippingTagSettingsService;

//     try {
//       this.loggedInUser_ = container.authenticatedUser;
//     } catch (e) {
//       // avoid errors when backend first runs
//     }
//   }

//   private calculateTemplateKind(
//     documentSettings: DocumentSettings,
//     documentShippingTagSettings: DocumentShippingTagSettings
//   ): ShippingTagTemplateKind {
//     if (
//       documentShippingTagSettings &&
//       documentShippingTagSettings.shipping_tag_template
//     ) {
//       return documentShippingTagSettings.shipping_tag_template as ShippingTagTemplateKind;
//     }
//     return ShippingTagTemplateKind.BASIC;
//   }

//   private calculateFormatNumber(
//     documentSettings: DocumentSettings,
//     documentShippingTagSettings: DocumentShippingTagSettings
//   ): string | undefined {
//     if (
//       documentShippingTagSettings &&
//       documentShippingTagSettings.shipping_tag_number_format
//     ) {
//       return documentShippingTagSettings.shipping_tag_number_format;
//     }
//     return undefined;
//   }

//   private async getNextShippingTagNumber(
//     resetForcedNumber?: boolean
//   ): Promise<string> {
//     const forcedNumber: string | undefined =
//       await this.documentShippingTagSettingsService.getShippingTagForcedNumber();

//     if (forcedNumber !== undefined) {
//       if (resetForcedNumber) {
//         await this.documentShippingTagSettingsService.resetForcedNumberByCreatingNewSettings();
//       }
//       return forcedNumber;
//     }

//     const lastShippingTag: ShippingTag | null = await this.activeManager_
//       .getRepository(ShippingTag)
//       .createQueryBuilder("shippingTag")
//       .orderBy("created_at", "DESC")
//       .getOne();
//     if (lastShippingTag !== null) {
//       return (parseInt(lastShippingTag.number) + 1).toString();
//     }
//     return "1";
//   }

//   async getShippingTag(
//     shippingTagId: string,
//     includeBuffer: boolean = false
//   ): Promise<ShippingTagResult> {
//     if (includeBuffer) {
//       const shippingTag: ShippingTag | null = await this.activeManager_
//         .getRepository(ShippingTag)
//         .createQueryBuilder("shippingTag")
//         .leftJoinAndSelect("shippingTag.document_settings", "document_settings")
//         .leftJoinAndSelect("document_settings.store_address", "store_address")
//         .leftJoinAndSelect(
//           "shippingTag.document_shipping_tag_settings",
//           "document_shipping_tag_settings"
//         )
//         .leftJoinAndSelect("shippingTag.order", "order")
//         .where("shippingTag.id = :shippingTagId", {
//           shippingTagId: shippingTagId,
//         })
//         .getOne();

//       if (
//         shippingTag &&
//         shippingTag !== null &&
//         shippingTag.document_settings
//       ) {
//         const order = await this.orderService.retrieveWithTotals(
//           shippingTag.order.id,
//           {
//             relations: ["shipping_address"],
//           }
//         );
//         const calculatedTemplateKind = this.calculateTemplateKind(
//           shippingTag.document_settings,
//           shippingTag.document_shipping_tag_settings
//         );
//         const buffer = await generateShippingTag(
//           calculatedTemplateKind,
//           shippingTag.document_settings,
//           shippingTag,
//           order
//         );
//         return {
//           shippingTag: shippingTag,
//           buffer: buffer,
//         };
//       }
//     }

//     const shippingTag: ShippingTag | null = await this.activeManager_
//       .getRepository(ShippingTag)
//       .createQueryBuilder("shippingTag")
//       .where("shippingTag.id = :shippingTagId", {
//         shippingTagId: shippingTagId,
//       })
//       .getOne();

//     if (shippingTag && shippingTag !== null) {
//       return {
//         shippingTag: shippingTag,
//       };
//     }
//     return {
//       shippingTag: undefined,
//       buffer: undefined,
//     };
//   }

//   async generateShippingTagForOrder(
//     orderId: string
//   ): Promise<ShippingTagResult> {
//     const order = await this.orderService.retrieveWithTotals(orderId, {
//       relations: ["shipping_address"],
//     });
//     if (order) {
//       const settings = await this.getLastDocumentSettings();
//       if (settings) {
//         const shippingTagSettings: DocumentShippingTagSettings | undefined =
//           await this.documentShippingTagSettingsService.getDocumentShippingTagSettings();
//         if (shippingTagSettings) {
//           const calculatedTemplateKind = this.calculateTemplateKind(
//             settings,
//             shippingTagSettings
//           );
//           const [validationPassed, info] = validateInputForProvidedKind(
//             calculatedTemplateKind,
//             settings
//           );
//           if (validationPassed) {
//             const RESET_FORCED_NUMBER = true;
//             const nextNumber: string = await this.getNextShippingTagNumber(
//               RESET_FORCED_NUMBER
//             );
//             const newEntry = this.activeManager_.create(ShippingTag);
//             newEntry.number = nextNumber;

//             const shippingTagFormatNumber = this.calculateFormatNumber(
//               settings,
//               shippingTagSettings
//             );

//             newEntry.display_number = shippingTagFormatNumber
//               ? shippingTagFormatNumber.replace(
//                   SHIPPING_TAG_NUMBER_PLACEHOLDER,
//                   newEntry.number
//                 )
//               : newEntry.number;
//             newEntry.order = order;
//             newEntry.document_settings = settings;
//             newEntry.document_shipping_tag_settings = shippingTagSettings;

//             const resultShippingTag = await this.activeManager_
//               .getRepository(ShippingTag)
//               .save(newEntry);

//             const metaDataUpdate = setMetadata(order, {
//               shipping_tag_id: resultShippingTag.id,
//             });

//             order.metadata = metaDataUpdate;

//             await this.activeManager_.getRepository(Order).save(order);

//             const buffer = await generateShippingTag(
//               calculatedTemplateKind,
//               settings,
//               resultShippingTag,
//               order
//             );

//             return {
//               shippingTag: newEntry,
//               buffer: buffer,
//             };
//           } else {
//             throw new MedusaError(MedusaError.Types.INVALID_DATA, info);
//           }
//         } else {
//           throw new MedusaError(
//             MedusaError.Types.INVALID_DATA,
//             "Retrieve shipping tag settings failed. Please check if they are set."
//           );
//         }
//       } else {
//         throw new MedusaError(
//           MedusaError.Types.INVALID_DATA,
//           "Retrieve document settings failed. Please check if they are set."
//         );
//       }
//     } else {
//       throw new MedusaError(
//         MedusaError.Types.INVALID_DATA,
//         "Can't retrieve order"
//       );
//     }
//   }

//   async getLastDocumentSettings(): Promise<DocumentSettings | undefined> {
//     const documentSettingsRepository =
//       this.activeManager_.getRepository(DocumentSettings);
//     const lastDocumentSettings: DocumentSettings | null =
//       await documentSettingsRepository
//         .createQueryBuilder("documentSettings")
//         .leftJoinAndSelect("documentSettings.store_address", "store_address")
//         .where("documentSettings.store_id = :storeId", {
//           storeId: this.loggedInUser_.store_id,
//         })
//         .orderBy("documentSettings.created_at", "DESC")
//         .getOne();

//     if (lastDocumentSettings === null) {
//       return undefined;
//     }

//     return lastDocumentSettings;
//   }
// }
