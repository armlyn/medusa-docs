import { Alert } from "@medusajs/ui";
import {
  Container,
  Heading,
  RadioGroup,
  Label,
  Button,
  toast,
} from "@medusajs/ui";
import { useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";

import {
  AdminStoreDocumentShippingTabSettingsQueryReq,
  ShippingTabResult,
  StoreDocumentShippingTabSettingsResult,
} from "../../types/api";
enum ShippingTabTemplateKind {
  BASIC = "BASIC",
  BASIC_A7 = "BASIC_A7",
}

type AdminGenerateShippingTabQueryReq = {
  template: ShippingTabTemplateKind;
};

const ViewExampleShippingTab = ({
  kind,
}: {
  kind: ShippingTabTemplateKind;
}) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery<
    AdminGenerateShippingTabQueryReq,
    ShippingTabResult
  >(`/shipping-tab/generate`, ["shipping-tab"], {
    template: kind,
  });

  if (isLoading) {
    return (
      <Grid container justifyContent={"center"}>
        <Grid item>
          <CircularProgress size={12} />
        </Grid>
      </Grid>
    );
  }

  if (isError) {
    const trueError = error as any;
    if (trueError.response?.data?.message) {
      return <Alert variant="error">{trueError.response.data.message}</Alert>;
    } else {
      return <Alert variant="error">No se puede generar la vista previa</Alert>;
    }
  }

  if (data && data.buffer) {
    const anyBuffer = data.buffer as any;
    const blob = new Blob([new Uint8Array(anyBuffer.data)], {
      type: "application/pdf",
    });
    const pdfURL = URL.createObjectURL(blob);
    return <iframe src={pdfURL} width={330} height={500}></iframe>;
  } else {
    return <Alert variant="error">No se puede generar la vista previa</Alert>;
  }
};

type ChooseTemplateProps = {
  lastKind: ShippingTabTemplateKind;
  setKind: (kind: ShippingTabTemplateKind) => void;
};

const ChooseTemplate = (props: ChooseTemplateProps) => {
  const handleChange = (checked: string) => {
    props.setKind(checked as ShippingTabTemplateKind);
  };

  return (
    <RadioGroup
      onValueChange={handleChange}
      defaultValue={props.lastKind.toString()}
    >
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={ShippingTabTemplateKind.BASIC.toString()}
          id={ShippingTabTemplateKind.BASIC.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          Básico
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={ShippingTabTemplateKind.BASIC_A7.toString()}
          id={ShippingTabTemplateKind.BASIC_A7.toString()}
        />
        <Label htmlFor="radio_2" weight="plus">
          Básico A7
        </Label>
      </div>
    </RadioGroup>
  );
};

type AdminShippingTabTemplatePostReq = {
  shippingTabTemplate: ShippingTabTemplateKind;
};

const ShippingTabContent = ({
  lastKind,
}: {
  lastKind?: ShippingTabTemplateKind;
}) => {
  const [templateKind, setTemplateKind] = useState<ShippingTabTemplateKind>(
    lastKind !== undefined && lastKind !== null
      ? lastKind
      : ShippingTabTemplateKind.BASIC
  );

  const { mutate } = useAdminCustomPost<
    AdminShippingTabTemplatePostReq,
    StoreDocumentShippingTabSettingsResult
  >(`/document-shipping-tab-settings/shipping-tab-template`, [
    "document-shipping-tab-settings",
  ]);

  const onSubmit = () => {
    return mutate(
      {
        shippingTabTemplate: templateKind,
      },
      {
        onSuccess: async ({ response, settings }) => {
          if (response.status == 201 && settings) {
            toast.success("Plantilla", {
              description: "Nueva plantilla guardada",
            });
          } else {
            toast.error("Plantilla", {
              description:
                "La plantilla no se puede guardar, ocurrió algún error.",
            });
          }
        },
        onError: () => {
          toast.error("Plantilla", {
            description:
              "La plantilla no se puede guardar, ocurrió algún error.",
          });
        },
      }
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} md={3} xl={3}>
        <Grid container rowSpacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <Alert>La vista previa se basa en el último pedido</Alert>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <Container>
              <Grid container rowSpacing={3} direction={"column"}>
                <Grid item>
                  <Heading level="h1">Elegir plantilla</Heading>
                </Grid>
                <Grid item>
                  <ChooseTemplate
                    lastKind={templateKind}
                    setKind={setTemplateKind}
                  />
                </Grid>
                <Grid item>
                  <Button variant="primary" onClick={onSubmit}>
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6} md={6} xl={6}>
        <ViewExampleShippingTab kind={templateKind} />
      </Grid>
    </Grid>
  );
};

export const ShippingTab = () => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminStoreDocumentShippingTabSettingsQueryReq,
    StoreDocumentShippingTabSettingsResult
  >("/document-shipping-tab-settings", ["shipping-tab-settings"], {});

  if (isLoading) {
    return <CircularProgress size={12} />;
  }

  return (
    <ShippingTabContent lastKind={data?.settings?.shipping_tab_template} />
  );
};
