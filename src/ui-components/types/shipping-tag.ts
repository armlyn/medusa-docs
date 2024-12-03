import { Order } from "@medusajs/medusa";

export type ShippingTag = {
  id: string;
  number: string;
  order: Order;

  createdAt: Date;
};
