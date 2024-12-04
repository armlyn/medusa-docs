import { Order } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { DocumentSettings } from "../../models/document-settings";
import PDFDocument from "pdfkit";
import { Invoice } from "../../models/invoice";

export function validateDocumentSettings(
  documentSettings: DocumentSettings
): [boolean, string] {
  if (!documentSettings.store_address) {
    return [false, "Store address is required to generate a shipping tag"];
  }
  return [true, ""];
}

export async function generateShippingTag(
  documentSettings: DocumentSettings,
  resultInvoice: Invoice,
  order: Order
): Promise<Buffer> {
  const [isValid, errorMessage] = validateDocumentSettings(documentSettings);
  if (!isValid) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, errorMessage);
  }

  const doc = new PDFDocument({ size: "A6", margin: 10 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  // Common header
  doc.fontSize(12).text("Shipping Tag", { align: "center" });
  doc.moveDown();

  // Shipping Tag Number
  doc
    .fontSize(10)
    .text(`Tag #: ${resultInvoice.display_number}`, { align: "right" });
  doc.moveDown();

  // From Address (Store Address)
  doc.fontSize(8).text("From:", { continued: true }).fontSize(10);
  if (documentSettings.store_address) {
    doc.text(`${documentSettings.store_address.address_1}`);
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
      `${order.shipping_address.first_name} ${order.shipping_address.last_name}`
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
    .text(`${order.id}`);
  doc
    .fontSize(8)
    .text("Order Date:", { continued: true })
    .fontSize(10)
    .text(`${order.created_at.toLocaleDateString()}`);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
