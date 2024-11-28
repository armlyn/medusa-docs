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
import { Grid, Link } from "@mui/material";

const HEIGHT = 330;

export const ProTab = () => {
  return (
    <Grid container spacing={2} justifyContent={"center"}>
      <Grid container justifyContent={"center"} marginTop={6}>
        <Grid item>
          <Heading level="h1" style={{ color: "purple" }}>
            Gestione documentos al siguiente nivel
          </Heading>
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} marginTop={1} spacing={5}>
        <Grid item xs={3} md={3} xl={3}>
          <Container
            style={{ borderColor: "purple", borderWidth: 1, height: HEIGHT }}
          >
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level="h1">Automatización</Heading>
              </Grid>
              <Grid item>
                <ul style={{ listStyleType: "circle" }}>
                  <li>
                    <Text>Enviar facturas automáticamente a los clientes</Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Enviar automáticamente albaranes al proveedor de gestión
                      logística
                    </Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>Detecta automáticamente el idioma de tu cliente</Text>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container
            style={{ borderColor: "purple", borderWidth: 1, height: HEIGHT }}
          >
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level="h1">Nuevas plantillas</Heading>
              </Grid>
              <Grid item>
                <ul style={{ listStyleType: "circle" }}>
                  <li>
                    <Text>
                      Acceda a nuevas plantillas premium para facturas y otros
                      documentos
                    </Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Envíanos tu plantilla personalizada y la crearemos para ti
                    </Text>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container
            style={{ borderColor: "purple", borderWidth: 1, height: HEIGHT }}
          >
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level="h1">Configuración avanzada</Heading>
              </Grid>
              <Grid item>
                <ul style={{ listStyleType: "circle" }}>
                  <li>
                    <Text>
                      Establecer diferentes direcciones para varios tipos de
                      documentos
                    </Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Personalizar la configuración para enviar facturas a los
                      clientes
                    </Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Personaliza la configuración para enviar albaranes a los
                      proveedores de logística
                    </Text>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container
            style={{ borderColor: "purple", borderWidth: 1, height: HEIGHT }}
          >
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level="h1">Soporte profesional</Heading>
              </Grid>
              <Grid item>
                <ul style={{ listStyleType: "circle" }}>
                  <li>
                    <Text>Prioridad en la resolución de errores</Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Canal dedicado para evaluar sus solicitudes de funciones
                    </Text>
                  </li>
                  <li style={{ marginTop: 3 }}>
                    <Text>
                      Cooperación a largo plazo, incluido el soporte para otros
                      complementos
                    </Text>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        direction={"column"}
        alignContent={"center"}
        marginTop={6}
      >
        <Grid
          container
          direction={"row"}
          justifyContent={"center"}
          columnSpacing={1}
        >
          <Grid item>
            <Heading level="h1" color="purple">
              Contacto:
            </Heading>
          </Grid>
          <Grid item>
            <Link href="mailto:labs@rsoftcon.com">
              <Heading level="h1" color="purple">
                labs@rsoftcon.com
              </Heading>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        direction={"column"}
        alignContent={"center"}
        marginTop={6}
      >
        <Grid
          container
          direction={"row"}
          justifyContent={"center"}
          columnSpacing={1}
        >
          <Grid item>
            <Text>
              Puede ocultar esta pestaña si cree que es intrusiva. Ver:
            </Text>
          </Grid>
          <Grid item>
            <Link href="https://github.com/RSC-Labs/medusa-documents?tab=readme-ov-file#hide-pro-version-tab">
              <Text>¿Cómo ocultar esta pestaña?</Text>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
