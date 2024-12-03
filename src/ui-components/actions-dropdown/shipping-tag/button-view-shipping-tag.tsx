import { FlyingBox } from "@medusajs/icons";
import { Order } from "@medusajs/medusa";
import { DropdownMenu, toast } from "@medusajs/ui";
import { useAdminCustomQuery } from "medusa-react";
import { ShippingTagResult } from "../../types/api";

type AdminGenerateShippingTagQueryReq = {
  shippingTagId: string;
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
      shippingTagId: order.metadata["shipping_tag_id"] as string,
      includeBuffer: true,
    },
    {
      enabled: false,
    }
  );

  const handleClick = async () => {
    toast.loading("Etiqueta de envío", {
      description: "Preparando etiqueta de envío...",
      duration: Infinity,
    });
    try {
      const result = await refetch();
      if (result.data && result.data.buffer) {
        toast.dismiss();
        openPdf(result.data);
      } else {
        toast.dismiss();
        toast.error("Etiqueta de envío", {
          description:
            "Se produjo un problema al preparar la etiqueta de envío.",
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Etiqueta de envío", {
        description: error,
      });
    } finally {
      toast.dismiss();
    }
  };

  const openPdf = (shippingTagResult?: ShippingTagResult) => {
    if (shippingTagResult && shippingTagResult.buffer) {
      const anyBuffer = shippingTagResult.buffer as any;
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
      <FlyingBox />
      Ver etiqueta de envío
    </DropdownMenu.Item>
  );
};

export default ViewShippingTagDropdownButton;
