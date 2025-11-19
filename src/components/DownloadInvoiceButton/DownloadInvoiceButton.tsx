import { FC } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { Job } from "../../types/types";

type DownloadInvoiceButtonProps = {
  job: Job;
};

export const DownloadInvoiceButton: FC<DownloadInvoiceButtonProps> = ({
  job,
}) => {
  const url = `/admin/customers/${job.customerId}/jobs/${job.id}/invoice`;

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<DownloadIcon />}
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Download invoice
    </Button>
  );
};
