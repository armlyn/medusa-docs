/*
 * 
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
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
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToOne(() => DocumentSettings, { eager: true })
  @JoinColumn({ name: 'document_settings_id' })
  document_settings: DocumentSettings;

  @OneToOne(() => DocumentShippingTagSettings, { nullable: true })
  @JoinColumn({ name: 'document_shipping_tag_settings_id' })
  document_shipping_tag_settings: DocumentShippingTagSettings;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "shipps")
  }
}