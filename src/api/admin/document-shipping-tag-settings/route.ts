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
import DocumentShippingTagSettingsService from "../../../services/document-shipping-tag-settings";
import { DocumentShippingTagSettings } from "../../../models/document-shipping-tag-settings";
import { ShippingTagTemplateKind } from "../../../services/types/template-kind";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentShippingTagSettingsService: DocumentShippingTagSettingsService = req.scope.resolve('documentShippingTagSettingsService');

  try {
    const lastDocumentPackingSlipSettings: DocumentShippingTagSettings | undefined = await documentShippingTagSettingsService.getDocumentShippingTagSettings();
    res.status(200).json({
      settings: lastDocumentPackingSlipSettings
    });
    
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const documentShippingTagSettingsService: DocumentShippingTagSettingsService = req.scope.resolve('documentShippingTagSettingsService');
  const formatNumber: string | undefined = body.formatNumber;
  const forcedNumber: string | undefined = body.forcedNumber;
  const template: string | undefined = body.template;

  try {
    const newSettings: DocumentShippingTagSettings | undefined = await documentShippingTagSettingsService.updateSettings(formatNumber, forcedNumber, template as ShippingTagTemplateKind);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update settings'
    })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}