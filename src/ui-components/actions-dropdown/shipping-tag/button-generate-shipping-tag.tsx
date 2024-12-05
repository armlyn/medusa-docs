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

import { FlyingBox } from "@medusajs/icons";
import { Order } from "@medusajs/medusa";
import { DropdownMenu, toast } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";
import { ShippingTagResult } from "../../types/api";

type AdminGenerateShippingTagPostReq = {
  orderId: string;
};

const GenerateShippingTagDropdownButton = ({ order }: { order: Order }) => {
  const { mutate } = useAdminCustomPost<
    AdminGenerateShippingTagPostReq,
    ShippingTagResult
    >(`/shipping-tag`, ["shipping-tag"]);
  const generate = () => {
    const id = toast.loading("Etiqueta de Envio", {
      description: "Generando etiqueta...",
      duration: Infinity,
    });
    mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: ({ response, buffer }) => {
          if (response.status == 201 && buffer) {
            const anyBuffer = buffer as any;
            const blob = new Blob([new Uint8Array(anyBuffer.data)], {
              type: "application/pdf",
            });
            toast.dismiss();
            const pdfURL = URL.createObjectURL(blob);
            window.open(pdfURL, "_blank");
          } else {
            toast.dismiss();
            toast.error("Etiqueta", {
              description: "El problema ocurrió al generar",
            });
          }
        },
        onError: (error) => {
          toast.dismiss();
          const trueError = error as any;
          toast.error("Etiqueta", {
            description: trueError?.response?.data?.message,
          });
        },
      }
    );
  };

  return (
    <DropdownMenu.Item className="gap-x-2" onClick={generate}>
      <FlyingBox />
      Generar etiqueta de envio
    </DropdownMenu.Item>
  );
};

export default GenerateShippingTagDropdownButton;
