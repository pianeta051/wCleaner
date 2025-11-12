import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { JobInvoice } from "../../../components/JobInvoice/JobInvoice";
import {
  FullScreenWrapper,
  TopBar,
  PdfContainer,
  ButtonDownload,
} from "./InvoicePreviewPage.style";
import { useJobInvoice } from "../../../hooks/Jobs/useJobInvoice";

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

  if (!jobId || !customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const loading = loadingInvoice || loadingJob;
  const error = errorInvoice ?? errorJob;

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
  if (error || !job || !job.customer) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  const doc = (
    <JobInvoice
      job={job}
      invoice={invoice}
      customer={job.customer}
      addresses={job.address}
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
