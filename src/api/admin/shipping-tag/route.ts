import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ShippingTagService from "../../../services/shipping-tag";
import { ShippingTagResult } from "../../../services/types/api";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingTagService: ShippingTagService =
    req.scope.resolve("shippingTagService");

  try {
    const body: any = req.body as any;
    const result: ShippingTagResult =
      await shippingTagService.generateShippingTagForOrder(body.orderId);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingTagService: ShippingTagService =
    req.scope.resolve("shippingTagService");

  const shippingTagId = req.query.shippingTagId;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: ShippingTagResult = await shippingTagService.getShippingTag(
      shippingTagId as string,
      includeBuffer !== undefined
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
