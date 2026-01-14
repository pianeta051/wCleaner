import { FC, useEffect, useState } from "react";
import { CircularProgress, Stack } from "@mui/material";
import { Job } from "../../types/types";
import { GenerateInvoiceButton } from "../GenerateInvoiceButton/GenerateInvoiceButton";
import { DownloadInvoiceButton } from "../DownloadInvoiceButton/DownloadInvoiceButton";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { ErrorCode } from "../../services/error";

type InvoiceActionButtonsProps = {
  job: Job;
  existing: boolean;
  loading: boolean;
  error: ErrorCode | null;
  onGenerated: () => void;
};

export const InvoiceActionButtons: FC<InvoiceActionButtonsProps> = ({
  job,
  existing,
  loading,
  error,
  onGenerated,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isInGroup } = useAuth();

  useEffect(() => {
    if (loading) {
      setHasLoaded(true);
    }
  }, [loading]);

  if (!isInGroup("Admin")) {
    return null;
  }

  if (error && error !== "INVOICE_NOT_FOUND") {
    return <ErrorMessage code={error} />;
  }
  if (loading && !hasLoaded) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" spacing={1}>
      {!existing ? (
        <GenerateInvoiceButton job={job} onGenerated={onGenerated} />
      ) : (
        <DownloadInvoiceButton job={job} />
      )}
    </Stack>
  );
};
