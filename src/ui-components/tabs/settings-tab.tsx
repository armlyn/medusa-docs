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

import { Container, Heading, Text } from "@medusajs/ui";
import { Grid } from "@mui/material";
import AddressChangeModal from "../settings/settings-address";
import LogoChangeModal from "../settings/settings-logo";
import InvoiceSettingsModal from "../settings/settings-invoice";

export const SettingsTab = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6} xl={6}>
        <Container>
          <Grid container>
            <Grid item>
              <Heading level="h1">Información de la tienda</Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Cambia la información sobre tu tienda para que se incluya en los
                documentos generados
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={"row"} columnSpacing={2}>
            <Grid item>
              <AddressChangeModal />
            </Grid>
            <Grid item>
              <LogoChangeModal />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item xs={6} md={6} xl={6}>
        <Container>
          <Grid container direction={"column"}>
            <Grid item>
              <Heading level="h1">Factura</Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Cambiar la configuración de cómo se generan las facturas
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={"row"} columnSpacing={2}>
            <Grid item>
              <InvoiceSettingsModal />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};
