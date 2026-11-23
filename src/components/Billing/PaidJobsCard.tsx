import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useBillingSummary } from "../../hooks/billing/useBillingSummary";

type PaidJobsCardProps = {
  start: string;
  end: string;
};

export const PaidJobsCard = ({ start, end }: PaidJobsCardProps) => {
  const { totalPaidJobs, loading, error } = useBillingSummary({ start, end });

  const formattedTotal = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(totalPaidJobs);

  return (
    <Card variant="outlined">
      <CardContent>
        <CheckCircleOutlineIcon color="success" />

        <Typography variant="h6">Paid</Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error">Unable to load billing summary</Typography>
        ) : (
          <Typography variant="h4" fontWeight="bold">
            {formattedTotal}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
