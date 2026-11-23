import { CircularProgress, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useBillingSummary } from "../../../hooks/billing/useBillingSummary";
import {
  BillingChartCard,
  BillingChartCenter,
  BillingChartContent,
  BillingChartLegend,
  BillingLegendDot,
  BillingLegendItem,
} from "../../../pages/admin/Billing/Billing.style";

type BillingChartProps = {
  start: string;
  end: string;
};

const PAID_COLOR = "#2E7D32";
const UNPAID_COLOR = "#ED6C02";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);

export const BillingChart = ({ start, end }: BillingChartProps) => {
  const { totalPaidJobs, totalUnpaidJobs, loading, error } = useBillingSummary({
    start,
    end,
  });

  const total = totalPaidJobs + totalUnpaidJobs;

  const chartData = [
    {
      id: 0,
      value: totalPaidJobs,
      label: "Paid",
      color: PAID_COLOR,
    },
    {
      id: 1,
      value: totalUnpaidJobs,
      label: "Unpaid",
      color: UNPAID_COLOR,
    },
  ];

  return (
    <BillingChartCard>
      <Typography variant="h6" fontWeight={700}>
        Payment Summary
      </Typography>

      <BillingChartContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Unable to load billing summary</Typography>
        ) : total === 0 ? (
          <Typography color="text.secondary">
            No completed jobs for this period
          </Typography>
        ) : (
          <>
            <PieChart
              series={[
                {
                  data: chartData,
                  innerRadius: 85,
                  outerRadius: 125,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              width={300}
              height={300}
              hideLegend
            />

            <BillingChartCenter>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {formatCurrency(total)}
              </Typography>
            </BillingChartCenter>
          </>
        )}
      </BillingChartContent>

      {!loading && !error && total > 0 && (
        <BillingChartLegend>
          <BillingLegendItem>
            <BillingLegendDot colorValue={PAID_COLOR} />
            <Typography variant="body2">
              Paid ({((totalPaidJobs / total) * 100).toFixed(1)}%)
            </Typography>
          </BillingLegendItem>

          <BillingLegendItem>
            <BillingLegendDot colorValue={UNPAID_COLOR} />
            <Typography variant="body2">
              Unpaid ({((totalUnpaidJobs / total) * 100).toFixed(1)}%)
            </Typography>
          </BillingLegendItem>
        </BillingChartLegend>
      )}
    </BillingChartCard>
  );
};
