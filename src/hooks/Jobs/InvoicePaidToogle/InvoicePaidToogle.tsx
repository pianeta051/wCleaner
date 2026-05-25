import { FC } from "react";
import { Chip, CircularProgress } from "@mui/material";
import { useUpdateInvoicePaid } from "../useUpdateInvoicePaid";

type InvoicePaidToggleProps = {
  customerId: string;
  jobId: string;
  paid: boolean;
  onUpdated?: () => void;
};

export const InvoicePaidToggle: FC<InvoicePaidToggleProps> = ({
  customerId,
  jobId,
  paid,
  onUpdated,
}) => {
  const { updateInvoicePaid, loading } = useUpdateInvoicePaid();

  const handleClick = async () => {
    await updateInvoicePaid({
      customerId,
      jobId,
      paid: !paid,
    });

    onUpdated?.();
  };

  if (loading) {
    return <CircularProgress size={18} />;
  }

  return (
    <Chip
      label={paid ? "Paid" : "Unpaid"}
      color={paid ? "success" : "default"}
      variant={paid ? "filled" : "outlined"}
      onClick={handleClick}
      clickable
      size="small"
    />
  );
};
