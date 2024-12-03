import { Order } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { DocumentSettings } from "../../models/document-settings";
import { ShippingTag } from "../../models/shipping-tag";
import { ShippingTagTemplateKind } from "../types/template-kind";
import PDFDocument from "pdfkit";

export function validateInputForProvidedKind(
  kind: ShippingTagTemplateKind,
  documentSettings: DocumentSettings
): [boolean, string] {
  switch (kind) {
    case ShippingTagTemplateKind.BASIC:
    case ShippingTagTemplateKind.BASIC_A7:
      if (!documentSettings.store_address) {
        return [
          false,
          "Store address is required for basic shipping tag template",
        ];
      }
      break;
    default:
      return [false, "Unknown shipping tag template kind"];
  }
  return [true, ""];
}

export async function generateShippingTag(
  kind: ShippingTagTemplateKind,
  documentSettings: DocumentSettings,
  shippingTag: ShippingTag,
  order: Order
): Promise<Buffer> {
  const [isValid, errorMessage] = validateInputForProvidedKind(
    kind,
    documentSettings
  );
  if (!isValid) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, errorMessage);
  }

  const pageSize = kind === ShippingTagTemplateKind.BASIC_A7 ? "A7" : "A6";
  const doc = new PDFDocument({ size: pageSize, margin: 10 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  // Common header
  doc.fontSize(12).text("Shipping Tag", { align: "center" });
  doc.moveDown();

  // Shipping Tag Number
  doc
    .fontSize(10)
    .text(`Tag #: ${shippingTag.display_number}`, { align: "right" });
  doc.moveDown();

  // From Address (Store Address)
  doc.fontSize(8).text("From:", { continued: true }).fontSize(10);
  if (documentSettings.store_address) {
    doc.text(` ${documentSettings.store_address.address_1}`);
    if (documentSettings.store_address.address_2) {
      doc.text(documentSettings.store_address.address_2);
    }
    doc.text(
      `${documentSettings.store_address.city}, ${documentSettings.store_address.postal_code}`
    );
  }
  doc.moveDown();

  // To Address (Customer's Shipping Address)
  doc.fontSize(8).text("To:", { continued: true }).fontSize(10);
  if (order.shipping_address) {
    doc.text(
      ` ${order.shipping_address.first_name} ${order.shipping_address.last_name}`
    );
    doc.text(order.shipping_address.address_1);
    if (order.shipping_address.address_2) {
      doc.text(order.shipping_address.address_2);
    }
    doc.text(
      `${order.shipping_address.city}, ${order.shipping_address.postal_code}`
    );
    if (order.shipping_address.country_code) {
      doc.text(order.shipping_address.country_code);
    }
  }
  doc.moveDown();

  // Order Information
  doc
    .fontSize(8)
    .text("Order ID:", { continued: true })
    .fontSize(10)
    .text(` ${order.id}`);
  doc
    .fontSize(8)
    .text("Order Date:", { continued: true })
    .fontSize(10)
    .text(` ${order.created_at.toLocaleDateString()}`);

  // Adjust font sizes for A7 if necessary
  if (kind === ShippingTagTemplateKind.BASIC_A7) {
    doc.fontSize(6);
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
