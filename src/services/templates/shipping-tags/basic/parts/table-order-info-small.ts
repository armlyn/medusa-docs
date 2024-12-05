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

import { LineItem, Order } from "@medusajs/medusa";
import { generateHrInA7 } from "./hr";
import { t } from "i18next";

function generateTableRow(
  doc,
  y,
  orderNumber,
  orderDate,
  shippingMethod,
) {
  doc
    .fontSize(6)
    .text(orderNumber, 25, y)
    .text(orderDate, 80, y)
    .text(shippingMethod, 90, y, { align: "right", width: 100 });
}

export function generateOrderInfoTable(doc, y, order: Order, items: LineItem[]) : number {
  const invoiceTableTop = y + 25;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-order-number", "Order #"),
    t("packing-slip-table-header-order-date", "Order date"),
    t("packing-slip-table-header-shipping-method", "Shipping method"),
  );
  generateHrInA7(doc, invoiceTableTop + 10);
  doc.font("Regular");

  const position = invoiceTableTop + 20;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleDateString(),
    order.shipping_methods[0].shipping_option.name
  );

  generateHrInA7(doc, position + 10);

  return position + 10;
}