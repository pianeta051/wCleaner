import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useJobCustomer } from "../../../../hooks/Jobs/useJobCustomer";
import { JobInvoice } from "../../../../components/JobInvoice/JobInvoice";
import {
  FullScreenWrapper,
  TopBar,
  PdfContainer,
  ButtonDownload,
} from "./InvoicePreviewPage.style";
import { useJobInvoice } from "../../../../hooks/Invoices/useJobInvoice";
import { useInvoiceSettings } from "../../../../hooks/Invoices/useInvoiceSettings";

type Params = {
  jobId: string;
  customerId?: string;
};

export const InvoicePreviewPage: FC = () => {
  const { jobId, customerId } = useParams<Params>();

  const {
    invoice,
    loading: loadingInvoice,
    error: errorInvoice,
  } = useJobInvoice(customerId, jobId);

  const {
    job,
    loading: loadingJob,
    error: errorJob,
  } = useJobCustomer(customerId, jobId);

  const {
    settings,
    loading: loadingSettings,
    error: errorSettings,
  } = useInvoiceSettings();

  if (!jobId || !customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const loading = loadingInvoice || loadingJob || loadingSettings;
  const error = errorInvoice ?? errorJob ?? errorSettings;

  const fileName = useMemo(() => {
    if (!invoice?.invoiceNumber) return "invoice.pdf";
    return `${invoice.invoiceNumber}.pdf`;
  }, [invoice?.invoiceNumber]);

  if (loading) {
    return (
      <FullScreenWrapper>
        <CircularProgress sx={{ margin: "auto" }} />
      </FullScreenWrapper>
    );
  }

  if (error || !job || !job.customer || !invoice || !settings) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  const doc = (
    <JobInvoice
      job={job}
      invoice={invoice}
      customer={job.customer}
      addresses={job.address}
      settings={settings}
    />
  );

  return (
    <FullScreenWrapper>
      <TopBar>
        <PDFDownloadLink document={doc} fileName={fileName}>
          {({ loading }) => (
            <ButtonDownload variant="contained" size="small">
              {loading ? "Preparing..." : "Download PDF"}
            </ButtonDownload>
          )}
        </PDFDownloadLink>
      </TopBar>

      <PdfContainer>
        <PDFViewer width="100%" height="100%">
          {doc}
        </PDFViewer>
      </PdfContainer>
    </FullScreenWrapper>
  );
};
