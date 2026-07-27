import { FC, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";

import { useGenerateInvoice } from "../../hooks/Invoices/useGenerateInvoice";
import { InvoiceForm, InvoiceFormValues } from "../InvoiceForm/InvoiceForm";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Job } from "../../types/types";

type GenerateInvoiceModalProps = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  job: Job;
  onGenerated: () => void;
};

export const GenerateInvoiceModal: FC<GenerateInvoiceModalProps> = ({
  open,
  onClose,
  customerId,
  job,
  onGenerated,
}) => {
  const { generate, loading, error } = useGenerateInvoice(customerId, job.id);

  const [firstNumberDialogOpen, setFirstNumberDialogOpen] = useState(false);
  const [firstInvoiceNumber, setFirstInvoiceNumber] = useState("");
  const [firstNumberError, setFirstNumberError] = useState<string>();
  const [pendingFormValues, setPendingFormValues] =
    useState<InvoiceFormValues>();

  const completeGeneration = () => {
    setPendingFormValues(undefined);
    setFirstInvoiceNumber("");
    setFirstNumberError(undefined);
    setFirstNumberDialogOpen(false);

    onGenerated();
    onClose();
  };

  const handleSubmit = async (formValues: InvoiceFormValues) => {
    try {
      await generate(formValues);
      completeGeneration();
    } catch (error) {
      if (error === "FIRST_INVOICE_NUMBER_REQUIRED") {
        setPendingFormValues(formValues);
        setFirstNumberError(undefined);
        setFirstNumberDialogOpen(true);
        return;
      }

      console.error("Failed to generate invoice:", error);
    }
  };

  const submitFirstInvoiceNumber = async () => {
    const parsedNumber = Number(firstInvoiceNumber);

    if (!Number.isSafeInteger(parsedNumber) || parsedNumber < 1) {
      setFirstNumberError("Enter a valid invoice number greater than zero.");
      return;
    }

    if (!pendingFormValues) {
      setFirstNumberError("Invoice information is missing.");
      return;
    }

    try {
      setFirstNumberError(undefined);

      await generate({
        ...pendingFormValues,
        firstInvoiceNumber: parsedNumber,
      });

      completeGeneration();
    } catch (error) {
      if (error === "INVALID_FIRST_INVOICE_NUMBER") {
        setFirstNumberError("The first invoice number is invalid.");
        return;
      }

      if (error === "INVOICE_NUMBER_IN_USE") {
        setFirstNumberError("That invoice number is already in use.");
        return;
      }

      console.error("Failed to generate first invoice:", error);
    }
  };

  const closeHandler = () => {
    if (loading) {
      return;
    }

    setPendingFormValues(undefined);
    setFirstInvoiceNumber("");
    setFirstNumberError(undefined);
    setFirstNumberDialogOpen(false);

    onClose();
  };

  const closeFirstNumberDialog = () => {
    if (loading) {
      return;
    }

    setFirstNumberDialogOpen(false);
    setFirstNumberError(undefined);
  };

  const visibleError =
    error && error !== "FIRST_INVOICE_NUMBER_REQUIRED" ? error : undefined;

  return (
    <>
      <Dialog open={open} onClose={closeHandler} fullWidth maxWidth="sm">
        <DialogTitle>Generate Invoice</DialogTitle>

        <InvoiceForm
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={closeHandler}
          defaultValues={{
            date: dayjs(job.date),
            description: "",
            addressId: job.addressId as string,
          }}
          customerId={customerId}
        />

        {visibleError && <ErrorMessage code={visibleError} />}
      </Dialog>

      <Dialog
        open={firstNumberDialogOpen}
        onClose={closeFirstNumberDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>First invoice number</DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            No previous invoices were found. Enter the number from which invoice
            numbering should begin.
          </Alert>

          <TextField
            autoFocus
            fullWidth
            type="number"
            label="First invoice number"
            value={firstInvoiceNumber}
            onChange={(event) => {
              setFirstInvoiceNumber(event.target.value);
              setFirstNumberError(undefined);
            }}
            error={!!firstNumberError}
            helperText={
              firstNumberError ??
              "The next invoices will continue from this number."
            }
            slotProps={{
              htmlInput: {
                min: 1,
                step: 1,
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeFirstNumberDialog} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitFirstInvoiceNumber}
            disabled={loading || !firstInvoiceNumber.trim()}
          >
            {loading ? "Generating..." : "Generate invoice"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
