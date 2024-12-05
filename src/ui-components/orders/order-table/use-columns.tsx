import moment from "moment";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import { Tooltip, StatusBadge, Text } from "@medusajs/ui";
import { FulfillmentStatus, LineItemTaxLine } from "@medusajs/medusa";
import { currencies } from "./utils/currencies";
import { Grid } from "@mui/material";
import { ActionsDropdown } from "../../actions-dropdown/actions-dropdown";
import InvoiceNumberFromOrder from "./invoice-number-from-order";
import PackingSlipNumber from "./packing-slip-number";
import ShippingTagNumber from "./shipping-tag-number";
import { ExclamationCircle, InformationCircle } from "@medusajs/icons";
import Link from "@mui/material/Link";

/**
 * Checks the list of currencies and returns the divider/multiplier
 * that should be used to calculate the persited and display amount.
 * @param currency
 * @return {number}
 */
export function getDecimalDigits(currency: string) {
  const divisionDigits = currencies[currency.toUpperCase()].decimal_digits;
  return Math.pow(10, divisionDigits);
}

export function normalizeAmount(currency: string, amount: number): number {
  const divisor = getDecimalDigits(currency);
  return Math.floor(amount) / divisor;
}

type FormatMoneyProps = {
  amount: number;
  currency: string;
  digits?: number;
  tax?: number | LineItemTaxLine[];
};

function formatAmountWithSymbol({
  amount,
  currency,
  digits,
  tax = 0,
}: FormatMoneyProps) {
  let locale = "en-US";

  // We need this to display 'Kr' instead of 'DKK'
  if (currency.toLowerCase() === "dkk") {
    locale = "da-DK";
  }

  digits = digits ?? currencies[currency.toUpperCase()].decimal_digits;

  const normalizedAmount = normalizeAmount(currency, amount);

  const taxRate =
    tax instanceof Array ? tax.reduce((acc, curr) => acc + curr.rate, 0) : tax;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
  }).format(normalizedAmount * (1 + taxRate / 100));
}

const useOrderTableColums = () => {
  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return <StatusBadge color="green">Pagado</StatusBadge>;
      case "awaiting":
        return <StatusBadge color="grey">Esperando</StatusBadge>;
      case "requires_action":
        return <StatusBadge color="red">Requiere acción</StatusBadge>;
      case "canceled":
        return <StatusBadge color="orange">Cancelado</StatusBadge>;
      default:
        return <StatusBadge color="purple">N/A</StatusBadge>;
    }
  };
  const decideFullfillmentStatus = (status) => {
    switch (status) {
      case "not_fulfilled":
        return <StatusBadge color="grey">No cumplido</StatusBadge>;
      case "partially_fulfilled":
        return <StatusBadge color="blue">Cumplido parcialmente</StatusBadge>;
      case "fulfilled":
        return <StatusBadge color="green">Cumplido</StatusBadge>;
      case "partially_shipped":
        return <StatusBadge color="blue">Enviado parcialmente</StatusBadge>;
      case "shipped":
        return <StatusBadge color="green">Enviado</StatusBadge>;
      case "partially_returned":
        return <StatusBadge color="blue">Cumplido parcialmente</StatusBadge>;
      case "returned":
        return <StatusBadge color="green">Devuelto</StatusBadge>;
      case "canceled":
        return <StatusBadge color="red">Cancelado</StatusBadge>;
      case "requires_action":
        return <StatusBadge color="purple">Requiere acción</StatusBadge>;
      default:
        return <StatusBadge color="grey">N/A</StatusBadge>;
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">{"Order"}</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => {
          return (
            <Tooltip
              content={
                <Text>{moment(value).format("DD MMM YYYY hh:mm a")}</Text>
              }
            >
              <p className="text-grey-90 group-hover:text-violet-60 min-w-[40px]">
                {moment(value).format("DD MMM YYYY")}
              </p>
            </Tooltip>
          );
        },
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => {
          const customer = {
            first_name:
              value?.first_name || row.original.shipping_address?.first_name,
            last_name:
              value?.last_name || row.original.shipping_address?.last_name,
            email: row.original.email,
          };
          return (
            <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px]">{`${
              customer.first_name || customer.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : customer.email
                ? customer.email
                : "-"
            }`}</p>
          );
        },
      },
      {
        Header: "Fulfillment",
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFullfillmentStatus(value),
      },
      {
        Header: "Payment status",
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: () => <div className="text-right">{"Total"}</div>,
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-grey-90 group-hover:text-violet-60 text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>{"Documents"}</div>,
        id: "invoice_number",
        Cell: ({ row }) => {
          return (
            <p className="text-grey-90 group-hover:text-violet-60 pl-2">
              <Grid
                container
                justifyContent={"flex-start"}
                direction={"column"}
                spacing={1}
              >
                {row.original.metadata["invoice_id"] !== undefined && (
                  <Grid item>
                    <InvoiceNumberFromOrder
                      invoiceId={row.original.metadata["invoice_id"]}
                    />
                  </Grid>
                )}
                {row.original.metadata["packing_slip_id"] !== undefined && (
                  <Grid item>
                    <PackingSlipNumber
                      packingSlipId={row.original.metadata["packing_slip_id"]}
                    />
                  </Grid>
                )}
                {row.original.metadata["shipping_tag_id"] !== undefined && (
                  <Grid item>
                    <ShippingTagNumber
                      shippingTagId={row.original.metadata["shipping_tag_id"]}
                    />
                  </Grid>
                )}
              </Grid>
            </p>
          );
        },
      },
      {
        Header: () => (
          <Grid
            container
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={1}
          >
            <Grid item>
              <Tooltip
                content={
                  <Grid item>
                    <Text size="small">No almacenamos documentos. </Text>
                    <Link
                      fontSize={12}
                      href="https://github.com/RSC-Labs/medusa-documents?tab=readme-ov-file#what-means-we-do-not-store-documents"
                    >
                      Learn more what it means.{" "}
                    </Link>
                  </Grid>
                }
              >
                <InformationCircle />
              </Tooltip>
            </Grid>
            <Grid item>{"Actions"}</Grid>
          </Grid>
        ),
        id: "actions",
        Cell: ({ row }) => {
          return (
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <ActionsDropdown order={row.original} />
              </Grid>
            </Grid>
          );
        },
      },
    ],
    []
  );

  return [columns];
};

export default useOrderTableColums;
