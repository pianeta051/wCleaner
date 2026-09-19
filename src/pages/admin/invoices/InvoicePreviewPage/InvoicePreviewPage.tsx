import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { JobInvoice } from "../../../../components/JobInvoice/JobInvoice";
import { useJobCustomer } from "../../../../hooks/Jobs/useJobCustomer";
import { useCustomer } from "../../../../hooks/Customers/useCustomer";
import { useJobInvoice } from "../../../../hooks/Invoices/useJobInvoice";
import { useInvoiceSettings } from "../../../../hooks/Invoices/useInvoiceSettings";
import { useFileUrl } from "../../../../hooks/Invoices/useFileUrl";

import {
  FullScreenWrapper,
  TopBar,
  PdfContainer,
  ButtonDownload,
} from "./InvoicePreviewPage.style";

type Params = {
  jobId: string;
  customerSlug: string;
};

export const InvoicePreviewPage: FC = () => {
  const { jobId, customerSlug } = useParams<Params>();

  const {
    customer,
    loading: loadingCustomer,
    error: errorCustomer,
  } = useCustomer(customerSlug);

  const {
    invoice,
    loading: loadingInvoice,
    error: errorInvoice,
  } = useJobInvoice(customer?.id, jobId);

  const {
    job,
    loading: loadingJob,
    error: errorJob,
  } = useJobCustomer(customer?.id, jobId);

  const {
    settings,
    loading: loadingSettings,
    error: errorSettings,
  } = useInvoiceSettings();

  const {
    fileUrl: logoSignedUrl,
    loading: loadingLogo,
    error: errorLogo,
  } = useFileUrl(settings?.logoUrl);

  const fileName = useMemo(() => {
    if (!invoice?.invoiceNumber) {
      return "invoice.pdf";
    }

    return `${invoice.invoiceNumber}.pdf`;
  }, [invoice?.invoiceNumber]);

  if (!jobId || !customerSlug) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const loading =
    loadingCustomer ||
    loadingInvoice ||
    loadingJob ||
    loadingSettings ||
    loadingLogo;

  const error =
    errorCustomer ?? errorInvoice ?? errorJob ?? errorSettings ?? errorLogo;

  if (loading) {
    return (
      <FullScreenWrapper>
        <CircularProgress sx={{ margin: "auto" }} />
      </FullScreenWrapper>
    );
  }

  if (error || !customer || !job || !job.customer || !invoice || !settings) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  const document = (
    <JobInvoice
      job={job}
      invoice={invoice}
      customer={job.customer}
      addresses={job.address}
      settings={{
        ...settings,
        logoSignedUrl,
      }}
    />
  );

  return (
    <FullScreenWrapper>
      <TopBar>
        <PDFDownloadLink document={document} fileName={fileName}>
          {({ loading: preparingPdf }) => (
            <ButtonDownload
              variant="contained"
              size="small"
              disabled={preparingPdf}
            >
              {preparingPdf ? "Preparing..." : "Download PDF"}
            </ButtonDownload>
          )}
        </PDFDownloadLink>
      </TopBar>

      <PdfContainer>
        <PDFViewer width="100%" height="100%">
          {document}
        </PDFViewer>
      </PdfContainer>
    </FullScreenWrapper>
  );
};
