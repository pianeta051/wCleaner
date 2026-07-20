import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

type DownloadInvoiceButtonProps = {
  job: { id: string; customerId: string };
};

export const DownloadInvoiceButton: FC<DownloadInvoiceButtonProps> = ({
  job,
}) => {
  const url = `/admin/customers/${job.customerId}/jobs/${job.id}/invoice`;

  return (
    <Tooltip title="Download invoice">
      <IconButton
        color="primary"
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
      >
        <ReceiptLongIcon />
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
};
