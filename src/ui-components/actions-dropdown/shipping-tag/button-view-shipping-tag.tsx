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

import { DocumentText } from "@medusajs/icons";
import { Order } from "@medusajs/medusa";
import { DropdownMenu, toast } from "@medusajs/ui";
import { useAdminCustomQuery } from "medusa-react";
import { ShippingTagResult } from "../../types/api";

type AdminGenerateShippingTagQueryReq = {
  id: string;
  includeBuffer: boolean;
};

const ViewShippingTagDropdownButton = ({ order }: { order: Order }) => {
  const { data, refetch } = useAdminCustomQuery<
    AdminGenerateShippingTagQueryReq,
    ShippingTagResult
  >(
    "/shipping-tag",
    [],
    {
      id: order.metadata["shipping_tag_id"] as string,
      includeBuffer: true,
    },
    {
      enabled: false,
    }
  );
  const handleClick = async () => {
    const id = toast.loading("Etiqueta", {
      description: "Preparando...",
      duration: Infinity,
    });
    try {
      const result = await refetch();
      if (result.data && result.data.buffer) {
        toast.dismiss();
        openPdf(result.data);
      } else {
        toast.dismiss();
        toast.error("Albarán", {
          description: "El problema ocurrió durante la preparación",
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Albarán", {
        description: error,
      });
    } finally {
      toast.dismiss();
    }
  };

  const openPdf = (packingSlipResult?: ShippingTagResult) => {
    if (packingSlipResult && packingSlipResult.buffer) {
      const anyBuffer = packingSlipResult.buffer as any;
      const blob = new Blob([new Uint8Array(anyBuffer.data)], {
        type: "application/pdf",
      });
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, "_blank");
    }
  };

  return (
    <DropdownMenu.Item
      className="gap-x-2"
      onClick={handleClick}
      disabled={order.metadata["shipping_tag_id"] == undefined}
    >
      <DocumentText />
      Ver etiqueta de envio
    </DropdownMenu.Item>
  );
};

export default ViewShippingTagDropdownButton;
