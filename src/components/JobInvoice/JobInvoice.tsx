import { FC, useMemo } from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { Customer, Invoice, InvoiceSettings, Job } from "../../types/types";
import {
  pageStyles,
  headerStyles,
  titleStyles,
  billToStyles,
  tableStyles,
  totalsStyles,
  footerStyles,
} from "./JobInvoice.styles";

export type JobInvoiceProps = {
  job: Job;
  invoice: Invoice;
  customer: Customer;
  settings: InvoiceSettings;
  addresses?: string;
  discount?: number;
};

export const JobInvoice: FC<JobInvoiceProps> = ({
  job,
  invoice,
  customer,
  settings,
}) => {
  const invoiceNumber = invoice?.invoiceNumber ?? "N/A";
  const invoiceDate = invoice?.date
    ? dayjs(Number(invoice.date)).format("DD/MM/YYYY")
    : "";

  const price = Number(job.price) || 0;

  const rows = useMemo(
    () => [
      {
        description:
          invoice?.description || "Window Cleaning Service Inside and Outside",
        total: price,
      },
    ],
    [invoice?.description, price]
  );

  return (
    <Document>
      <Page size="A4" style={pageStyles.page}>
        <View style={headerStyles.container}>
          <Text style={headerStyles.companyName}>
            {settings.companyName || "Company Name"}
          </Text>

          {settings.companyAddressLines?.map((line, index) => (
            <Text key={`${line}-${index}`} style={headerStyles.companyLine}>
              {line}
            </Text>
          ))}

          {settings.companyPhone && (
            <Text style={headerStyles.companyLine}>
              Tel: {settings.companyPhone}
            </Text>
          )}

          {settings.companyWebsite && (
            <Text style={headerStyles.companyLine}>
              {settings.companyWebsite}
            </Text>
          )}
        </View>

        <View style={titleStyles.titleContainer}>
          <Text style={titleStyles.title}>Invoice</Text>
          <View style={titleStyles.invoiceInfo}>
            <Text>Invoice Nº: {invoiceNumber}</Text>
            <Text>{invoiceDate}</Text>
          </View>
        </View>

        <View style={billToStyles.container}>
          <Text style={billToStyles.label}>Bill To:</Text>
          <Text style={billToStyles.customerLine}>{customer.name}</Text>

          {invoice?.address?.address && (
            <Text style={billToStyles.customerLine}>
              {invoice.address.address}
            </Text>
          )}

          {invoice?.address?.postcode && (
            <Text style={billToStyles.customerLine}>
              {invoice.address.postcode}
            </Text>
          )}

          {customer.email && (
            <Text style={billToStyles.customerLine}>{customer.email}</Text>
          )}
        </View>

        <View style={tableStyles.tableContainer}>
          <View style={tableStyles.headerRow}>
            <Text style={tableStyles.cellDescription}>Description</Text>
            <Text style={tableStyles.cellTotal}>Total</Text>
          </View>

          {rows.map((row, i) => (
            <View style={tableStyles.row} key={i}>
              <View style={tableStyles.descriptionContainer}>
                <Text style={tableStyles.descriptionTitle}>
                  Work Description
                </Text>

                {row.description.split(/\r?\n/).map((line, index) => (
                  <Text key={index} style={tableStyles.descriptionLine}>
                    • {line.trim()}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={totalsStyles.container}>
          <View style={totalsStyles.row}>
            <Text>Subtotal:</Text>
            <Text>£ {price.toFixed(2)}</Text>
          </View>

          <View style={[totalsStyles.row, totalsStyles.bold]}>
            <Text>Grand Total:</Text>
            <Text>£ {price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={footerStyles.footer}>
          {settings.bankDetails && <Text>{settings.bankDetails}</Text>}
          {settings.paymentInfo && <Text>{settings.paymentInfo}</Text>}
        </View>
      </Page>
    </Document>
  );
};
