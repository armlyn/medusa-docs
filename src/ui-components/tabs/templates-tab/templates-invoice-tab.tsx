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
import { InvoiceTemplateKind } from "../../types/template-kind";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import {
  AdminStoreDocumentInvoiceSettingsQueryReq,
  InvoiceResult,
  StoreDocumentInvoiceSettingsResult,
} from "../../types/api";

type AdminGenerateInvoiceQueryReq = {
  template: InvoiceTemplateKind;
};

const ViewExampleInvoice = ({ kind }: { kind: InvoiceTemplateKind }) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery<
    AdminGenerateInvoiceQueryReq,
    InvoiceResult
  >(`/invoice/generate`, [], {
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
    return <iframe src={pdfURL} width={660} height={1000}></iframe>;
  } else {
    return <Alert variant="error">No se puede generar la vista previa</Alert>;
  }
};

type ChooseTemplateProps = {
  lastKind: InvoiceTemplateKind;
  setKind: (kind: InvoiceTemplateKind) => void;
};

const ChooseTemplate = (props: ChooseTemplateProps) => {
  const handleChange = (checked: string) => {
    props.setKind(checked as InvoiceTemplateKind);
  };

  return (
    <RadioGroup
      onValueChange={handleChange}
      defaultValue={props.lastKind.toString()}
    >
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC.toString()}
          id={InvoiceTemplateKind.BASIC.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          Básico
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC_LOGO.toString()}
          id={InvoiceTemplateKind.BASIC_LOGO.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          Básico con logo
        </Label>
      </div>
    </RadioGroup>
  );
};

type AdminInvoiceTemplatePostReq = {
  invoiceTemplate: InvoiceTemplateKind;
};

const TemplatesTabContent = ({
  lastKind,
}: {
  lastKind?: InvoiceTemplateKind;
}) => {
  const [templateKind, setTemplateKind] = useState<InvoiceTemplateKind>(
    lastKind !== undefined && lastKind !== null
      ? lastKind
      : InvoiceTemplateKind.BASIC
  );

  const { mutate } = useAdminCustomPost<
    AdminInvoiceTemplatePostReq,
    StoreDocumentInvoiceSettingsResult
  >(`/document-invoice-settings/invoice-template`, [
    "document-invoice-settings",
  ]);
  const onSubmit = () => {
    return mutate(
      {
        invoiceTemplate: templateKind,
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
        onError: ({}) => {
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
        <ViewExampleInvoice kind={templateKind} />
      </Grid>
    </Grid>
  );
};

export const InvoiceTemplatesTab = () => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminStoreDocumentInvoiceSettingsQueryReq,
    StoreDocumentInvoiceSettingsResult
  >("/document-invoice-settings", [""], {});
  if (isLoading) {
    return <CircularProgress size={12} />;
  }

  return <TemplatesTabContent lastKind={data?.settings?.invoice_template} />;
};
