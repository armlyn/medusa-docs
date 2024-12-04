import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ShippingTagTemplateKind } from "../../../../services/types/template-kind";
import ShippingTagService from "../../../../services/shipping-tag";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingTagService: ShippingTagService =
    req.scope.resolve("shippingTagService");

  try {
    const chosenTemplate = req.query.template;
    const shippingTagResult = await shippingTagService.generateTestShippingTag(
      chosenTemplate as ShippingTagTemplateKind
    );
    res.status(201).json(shippingTagResult);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
