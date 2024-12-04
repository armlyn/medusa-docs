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

import { Address } from "@medusajs/medusa";
import { Invoice } from "../../models/invoice";
import { PackingSlip } from "../../models/packing-slip";
import { ShippingTag } from "../../models/shipping-tag";
export type DocumentAddress = Omit<Address, "customer" | "country">;

export type InvoiceResult = {
  invoice?: Invoice;
  buffer?: Buffer;
};

export type PackingSlipResult = {
  packingSlip?: PackingSlip;
  buffer?: Buffer;
};
export type ShippingTagResult = {
  shippingTag?: ShippingTag;
  buffer?: Buffer;
};
