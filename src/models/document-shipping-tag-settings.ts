import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class DocumentShippingTagSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "store_id", nullable: true })
  store_id: string;

  @Column()
  shipping_tag_forced_number?: number;

  @Column()
  shipping_tag_number_format?: string;

  @Column()
  shipping_tag_template?: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "docshptagset");
  }
}
