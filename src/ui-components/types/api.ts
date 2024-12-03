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
import { InvoiceTemplateKind, PackingSlipTemplateKind } from "./template-kind";
import { Invoice } from "./invoice";
import { PackingSlip } from "./packing-slip";
import { ShippingTag } from "./shipping-tag";

export type DocumentAddress = Omit<Address, "customer" | "country">;

export type DocumentSettings = {
  id: string;
  store_address: DocumentAddress;
  store_logo_source: string;
  invoice_number_format: string;
  invoice_template: InvoiceTemplateKind;
};

export type DocumentInvoiceSettings = {
  id: string;
  invoice_number_format?: string;
  invoice_template?: InvoiceTemplateKind;
  invoice_forced_number?: string;
};

export type AdminStoreDocumentSettingsQueryReq = {};

export type StoreDocumentSettingsResult = {
  settings?: DocumentSettings;
};

export type AdminStoreDocumentInvoiceSettingsPostReq = {
  formatNumber?: string;
  forcedNumber?: number;
  template?: string;
};

export type AdminStoreDocumentInvoiceSettingsQueryReq = {};

export type StoreDocumentInvoiceSettingsResult = {
  settings?: DocumentInvoiceSettings;
};

export type AdminStoreDocumentAddressPostReq = {
  address: DocumentAddress;
};

export type InvoiceResult = {
  invoice?: Invoice;
  buffer?: Buffer;
};

export type AdminStoreDocumentPackingSlipSettingsQueryReq = {};

export type DocumentPackingSlipSettings = {
  id: string;
  number_format?: string;
  forced_number?: string;
  template?: PackingSlipTemplateKind;
};

export type StoreDocumentPackingSlipSettingsResult = {
  settings?: DocumentPackingSlipSettings;
};

export type PackingSlipResult = {
  packingSlip?: PackingSlip;
  buffer?: Buffer;
};
export type AdminStoreDocumentShippingTagSettingsQueryReq = {};

export type ShippingTagResult = {
  shippingTag?: ShippingTag;
  buffer: Buffer;
};

export type StoreDocumentShippingTagSettingsResult = {
  settings: any;
  response: any;
};
