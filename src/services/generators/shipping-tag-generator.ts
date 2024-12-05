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

import { ShippingTagTemplateKind } from "../types/template-kind";
import basicTemplate, { validateInput as validateInputBasic} from '../templates/shipping-tags/basic/basic'
import smallTemplate, { validateInput as validateInputSmall } from '../templates/shipping-tags/basic/small'
import { Order } from "@medusajs/medusa";
import { ShippingTag } from "../../models/shipping-tag";
import { DocumentSettings } from "../../models/document-settings";

export function validateInputForProvidedKind(templateKind: ShippingTagTemplateKind, documentSettings: DocumentSettings) : ([boolean, string]) {
  switch (templateKind) {
    case ShippingTagTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case ShippingTagTemplateKind.BASIC_SMALL:
      return validateInputSmall(documentSettings);
    default:
      return [false, 'Not supported template'];
  }
  
}

export function generate(kind: ShippingTagTemplateKind, documentSettings: DocumentSettings, shippingTag: ShippingTag, order: Order): Promise<Buffer> | undefined {
  switch (kind) {
    case ShippingTagTemplateKind.BASIC:
      return basicTemplate(documentSettings, shippingTag, order);
    case ShippingTagTemplateKind.BASIC_SMALL:
      return smallTemplate(documentSettings, shippingTag, order);
    default:
      return Promise.resolve(Buffer.from('Not supported template'));
  }
};