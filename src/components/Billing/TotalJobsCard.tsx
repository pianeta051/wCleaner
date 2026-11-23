import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useBillingSummary } from "../../hooks/billing/useBillingSummary";

type TotalJobsCardProps = {
  start: string;
  end: string;
};

export const TotalJobsCard = ({ start, end }: TotalJobsCardProps) => {
  const { totalPaidJobs, totalUnpaidJobs, loading, error } = useBillingSummary({
    start,
    end,
  });

  const total = totalPaidJobs + totalUnpaidJobs;

  const formattedTotal = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <AccountBalanceWalletIcon color="primary" />

        <Typography variant="h6">Total (All Jobs)</Typography>

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
