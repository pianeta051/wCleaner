import { FC } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { useGenerateInvoice } from "../../hooks/Jobs/useGenerateInvoice";
import { InvoiceForm, InvoiceFormValues } from "../InvoiceForm/InvoiceForm";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

type GenerateInvoiceModalProps = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  jobId: string;
  onGenerated: () => void;
};

export const GenerateInvoiceModal: FC<GenerateInvoiceModalProps> = ({
  open,
  onClose,
  customerId,
  jobId,
  onGenerated,
}) => {
  const { generate, loading, error } = useGenerateInvoice(customerId, jobId);

  const handleSubmit = async (formValues: InvoiceFormValues) => {
    try {
      await generate(formValues);
      onGenerated();
      onClose();
    } catch (e) {
      console.error("Failed to generate invoice:", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generate Invoice</DialogTitle>
      {error && <ErrorMessage code={error} />}
      <InvoiceForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
};
