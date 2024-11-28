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

import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui";
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useState } from "react";
import {
  AdminStoreDocumentAddressPostReq,
  AdminStoreDocumentSettingsQueryReq,
  DocumentAddress,
  StoreDocumentSettingsResult,
} from "../types/api";

const AddressField = ({
  name,
  placeholder,
  initValue,
  register,
}: {
  name: string;
  placeholder: string;
  initValue?: string;
  register: any;
}) => {
  return (
    <Grid container direction={"column"} spacing={1} marginTop={2}>
      <Grid item>
        <Label size="small">{name}</Label>
      </Grid>
      <Grid item>
        <Input
          placeholder={placeholder}
          {...register}
          defaultValue={initValue}
        />
      </Grid>
    </Grid>
  );
};

const AddressForm = ({
  address,
  setOpenModal,
}: {
  address?: DocumentAddress;
  setOpenModal: any;
}) => {
  const { register, handleSubmit } = useForm<DocumentAddress>();

  const { mutate } = useAdminCustomPost<
    AdminStoreDocumentAddressPostReq,
    StoreDocumentSettingsResult
  >(`/document-settings/document-address`, ["document-settings"]);
  const onSubmit = (data: DocumentAddress) => {
    return mutate(
      {
        address: data,
      },
      {
        onSuccess: async ({ response, settings }) => {
          if (response.status == 201 && settings) {
            toast.success("Dirección", {
              description: "Nueva dirección guardada",
            });
            setOpenModal(false);
          } else {
            toast.error("Dirección", {
              description:
                "La dirección no se puede guardar, ocurrió algún error.",
            });
          }
        },
        onError: ({}) => {
          toast.error("Dirección", {
            description:
              "La dirección no se puede guardar, ocurrió algún error..",
          });
        },
      }
    );
  };

  return (
    <form>
      <Grid container direction={"column"} rowSpacing={4} paddingTop={8}>
        <AddressField
          name="Nombre de la empresa"
          placeholder="Mi tienda"
          register={register("company")}
          initValue={address?.company}
        />
        <AddressField
          name="Nombre"
          placeholder="John"
          register={register("first_name")}
          initValue={address?.first_name}
        />
        <AddressField
          name="Apellido"
          placeholder="Doe"
          register={register("last_name")}
          initValue={address?.last_name}
        />
        <AddressField
          name="Calle 56"
          placeholder="56 Street"
          register={register("address_1")}
          initValue={address?.address_1}
        />
        <AddressField
          name="Ciudad"
          placeholder="Warsaw"
          register={register("city")}
          initValue={address?.city}
        />
        <AddressField
          name="Código postal"
          placeholder="55-200"
          register={register("postal_code")}
          initValue={address?.postal_code}
        />
        <Grid item>
          <Button
            type="submit"
            variant={"primary"}
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const AddressModalDetails = ({ setOpenModal }) => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminStoreDocumentSettingsQueryReq,
    StoreDocumentSettingsResult
  >("/document-settings", [""], {});

  if (isLoading) {
    return (
      <FocusModal.Body>
        <CircularProgress />
      </FocusModal.Body>
    );
  }

  return (
    <FocusModal.Body>
      <Grid
        container
        direction={"column"}
        alignContent={"center"}
        paddingTop={8}
      >
        <Grid item>
          <Heading>Dirección de la tienda</Heading>
        </Grid>
        <Grid item>
          <Text>Esta dirección se utilizará en sus documentos.</Text>
        </Grid>
        <Grid item>
          <Text>
            La presencia de un campo en el documento depende de la plantilla.
          </Text>
        </Grid>
        <Grid item>
          <AddressForm
            address={data?.settings?.store_address}
            setOpenModal={setOpenModal}
          />
        </Grid>
      </Grid>
    </FocusModal.Body>
  );
};

const AddressChangeModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>Cambiar dirección</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header />
        <AddressModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AddressChangeModal;
