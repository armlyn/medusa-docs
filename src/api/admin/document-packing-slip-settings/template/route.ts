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
import { PackingSlipTemplateKind } from "../../../../services/types/template-kind";
import DocumentPackingSlipSettingsService from "../../../../services/document-packing-slip-settings";
import { DocumentPackingSlipSettings } from "../../../../models/document-packing-slip-settings";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const documentPackingSlipSettingsService: DocumentPackingSlipSettingsService = req.scope.resolve('documentPackingSlipSettingsService');
  const template: string | undefined = body.packingSlipTemplate;

  try {
    const newSettings: DocumentPackingSlipSettings | undefined = await documentPackingSlipSettingsService.updatePackingSlipTemplate(template as PackingSlipTemplateKind);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update template'
    })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}