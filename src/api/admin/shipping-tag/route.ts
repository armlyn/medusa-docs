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
import ShippingTagService from "../../../services/shipping-tag";
import { ShippingTagResult } from "../../../services/types/api";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const shippingTagService: ShippingTagService = req.scope.resolve('shippingTagService');

  try {
    const body: any = req.body as any;
    const result: ShippingTagResult = await shippingTagService.create(body.orderId);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const shippingTagService: ShippingTagService = req.scope.resolve('shippingTagService');

  const id = req.query.id;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: ShippingTagResult = await shippingTagService.getShippingTag(id as string, includeBuffer !== undefined);
    res.status(200).json(result);
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}