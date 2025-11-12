import { FC, useCallback } from "react";
import { CircularProgress, Stack } from "@mui/material";
import { Job } from "../../types/types";
import { useJobInvoice } from "../../hooks/Jobs/useJobInvoice";
import { GenerateInvoiceButton } from "../GenerateInvoiceButton/GenerateInvoiceButton";
import { DownloadInvoiceButton } from "../DownloadInvoiceButton/DownloadInvoiceButton";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

type InvoiceActionButtonsProps = {
  job: Job;
  onGenerated: () => void;
};

export const InvoiceActionButtons: FC<InvoiceActionButtonsProps> = ({
  job,
  onGenerated,
}) => {
  const { isInGroup } = useAuth();
  const { invoice, loading, error, reload } = useJobInvoice(
    job.customerId,
    job.id
  );

  const generatedHandler = useCallback(() => {
    reload();
    onGenerated();
  }, []);

  if (!isInGroup("Admin")) {
    return null;
  }

  if (error && error !== "INVOICE_NOT_FOUND") {
    return <ErrorMessage code={error} />;
  }
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" spacing={1}>
      {!invoice ? (
        <GenerateInvoiceButton job={job} onGenerated={generatedHandler} />
      ) : (
        <DownloadInvoiceButton job={job} invoice={invoice} />
      )}
    </Stack>
  );
};
