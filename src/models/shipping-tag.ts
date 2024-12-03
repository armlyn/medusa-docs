import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity, Order } from "@medusajs/medusa";
import { DocumentSettings } from "./document-settings";
import { DocumentShippingTagSettings } from "./document-shipping-tag-settings";

@Entity()
export class ShippingTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  number: string;

  @Column()
  display_number: string;

  @OneToOne(() => Order, { eager: true })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @OneToOne(() => DocumentSettings, { eager: true })
  @JoinColumn({ name: "document_settings_id" })
  document_settings: DocumentSettings;

  @OneToOne(() => DocumentShippingTagSettings, { nullable: true })
  @JoinColumn({ name: "document_shipping_tag_settings_id" })
  document_shipping_tag_settings: DocumentShippingTagSettings;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "shptag");
  }
}
