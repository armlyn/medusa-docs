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

import { Tabs } from "@medusajs/ui";
import { Box } from "@mui/material";
import { InvoiceTemplatesTab } from "./templates-invoice-tab";
import { PackingSlipTemplatesTab } from "./templates-packing-slip-tab";
import { ShippingTagTemplatesTab } from "./templates-shipping-tag-tab";

export const TemplatesTab = () => {
  return (
    <Tabs defaultValue="invoice">
      <Tabs.List>
        <Tabs.Trigger value="invoice">Factura</Tabs.Trigger>
        <Tabs.Trigger value="packing-slip">Albarán</Tabs.Trigger>
        <Tabs.Trigger value="shipping-tag">Etiqueta</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="invoice">
        <Box height={20}></Box>
        <InvoiceTemplatesTab />
      </Tabs.Content>
      <Tabs.Content value="packing-slip">
        <Box height={20}></Box>
        <PackingSlipTemplatesTab />
      </Tabs.Content>
      <Tabs.Content value="shipping-tag">
        <Box height={20}></Box>
        <ShippingTagTemplatesTab />
      </Tabs.Content>
    </Tabs>
  );
};
