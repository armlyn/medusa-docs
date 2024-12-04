import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ShippingTagService from "../../../../services/shipping-tag";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingTagService: ShippingTagService =
    req.scope.resolve("shippingTagService");

  const formatNumber: string | undefined = req.query.formatNumber as string;
  const forcedNumber: string | undefined = req.query.forcedNumber as string;

  try {
    const nextDisplayNumber = await shippingTagService.getTestDisplayNumber(
      formatNumber,
      forcedNumber
    );
    res.status(201).json({
      displayNumber: nextDisplayNumber,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
