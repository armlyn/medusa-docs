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

import { useAdminCustomQuery } from "medusa-react";
import { ShippingTagResult } from "../../types/api";
import { CircularProgress } from "@mui/material";

type AdminShippingTagGetReq = {
  id: string;
};

const ShippingTagNumber = ({ shippingTagId }: { shippingTagId: string }) => {
  const { data, isLoading } = useAdminCustomQuery<
    AdminShippingTagGetReq,
    ShippingTagResult
  >("/shipping-tag", [""], {
    id: shippingTagId,
  });

  if (isLoading) {
    return <CircularProgress size={8} />;
  }

  if (data && data.shippingTag) {
    return (
      <p className="text-grey-90 group-hover:text-violet-60 pl-2">
        {`Etiqueta: ${data.shippingTag.display_number}`}
      </p>
    );
  }
};

export default ShippingTagNumber;
