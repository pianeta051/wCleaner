import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { useBillingSummary } from "../../hooks/billing/useBillingSummary";

type UnpaidJobsCardProps = {
  start: string;
  end: string;
};

export const UnpaidJobsCard = ({ start, end }: UnpaidJobsCardProps) => {
  const { totalUnpaidJobs, loading, error } = useBillingSummary({ start, end });

  const formattedTotal = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(totalUnpaidJobs);

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <PendingActionsIcon color="warning" />

        <Typography variant="h6">Unpaid</Typography>

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
