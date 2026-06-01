import { FC } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { useGenerateInvoice } from "../../hooks/Invoices/useGenerateInvoice";
import { InvoiceForm, InvoiceFormValues } from "../InvoiceForm/InvoiceForm";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Invoice, Job } from "../../types/types";
import dayjs from "dayjs";
import { useUpdateInvoice } from "../../hooks/Invoices/useUpdateInvoice";

type UpdateInvoiceModalProps = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  jobId: string;
  invoice: Invoice;
  onEdit?: () => void;
};

export const UpdateInvoiceModal: FC<UpdateInvoiceModalProps> = ({
  open,
  onClose,
  customerId,
  jobId,
  onEdit,
  invoice,
}) => {
  const { updateInvoice, loading, error } = useUpdateInvoice(customerId, jobId);

  const handleSubmit = async (formValues: InvoiceFormValues) => {
    try {
      await updateInvoice(formValues);
      onEdit?.();
      onClose();
    } catch (e) {
      console.error("Failed to generate invoice:", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Invoice</DialogTitle>

      <InvoiceForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
        defaultValues={{
          date: dayjs(invoice.date),
          description: invoice.description,
          addressId: invoice.addressId as string,
        }}
        customerId={customerId}
      />
      {error && <ErrorMessage code={error} />}
    </Dialog>
  );
};
