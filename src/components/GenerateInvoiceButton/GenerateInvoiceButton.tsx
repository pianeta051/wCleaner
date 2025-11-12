import { FC, useState } from "react";
import { Button } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import { Job } from "../../types/types";
import { GenerateInvoiceModal } from "../GenerateInvoiceModal/GenerateInvoiceModal";

type GenerateInvoiceButtonProps = {
  job: Job;
  onGenerated: () => void;
};

export const GenerateInvoiceButton: FC<GenerateInvoiceButtonProps> = ({
  job,
  onGenerated,
}) => {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        startIcon={<ReceiptIcon />}
        onClick={openModal}
      >
        Generate Invoice
      </Button>

      <GenerateInvoiceModal
        open={open}
        onClose={closeModal}
        customerId={job.customerId as string}
        job={job}
        onGenerated={() => {
          closeModal();
          onGenerated();
        }}
      />
    </>
  );
};
