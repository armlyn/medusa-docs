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

import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { ShippingTagTemplateKind } from "../../../../services/types/template-kind";
import ShippingTagService from "../../../../services/shipping-tag";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const shippingTagService: ShippingTagService = req.scope.resolve('shippingTagService');

  try {
    const chosenTemplate = req.query.template;
    const result = await shippingTagService.generatePreview(chosenTemplate as ShippingTagTemplateKind)
    res.status(201).json(result)
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}