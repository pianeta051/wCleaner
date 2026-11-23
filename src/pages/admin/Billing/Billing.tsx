import { useMemo, useState } from "react";
import { Grid, TextField } from "@mui/material";

import { TotalJobsCard } from "../../../components/Billing/TotalJobsCard";
import { PaidJobsCard } from "../../../components/Billing/PaidJobsCard";
import { UnpaidJobsCard } from "../../../components/Billing/UnpaidJobsCard";

import { BillingContainer, BillingHeader, BillingTitle } from "./Billing.style";
import { BillingChart } from "../../../components/Billing/Billing/BillingChart";

import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";

dayjs.extend(isoWeek);

export const Billing = () => {
  const [range, setRange] = useState(() => {
    const now = new Date();
    const d = dayjs(now);

    return {
      start: d.startOf("month").startOf("day"),
      end: d.endOf("month").endOf("day"),
    };
  });

  const start = range.start.format("YYYY-MM-DD HH:mm");
  const end = range.end.format("YYYY-MM-DD HH:mm");

  const setSelectedMonth = (yearAndMonth: string) => {
    const d = dayjs(yearAndMonth, "YYYY-MM");

    const range = {
      start: d.startOf("month").startOf("day"),
      end: d.endOf("month").endOf("day"),
    };
    setRange(range);
  };

  const formValue = useMemo(() => range.start.format("YYYY-MM"), [range]);

  return (
    <BillingContainer>
      <BillingHeader>
        <BillingTitle variant="h4">Job Prices Summary</BillingTitle>

        <TextField
          label="Select Month"
          type="month"
          value={formValue}
          onChange={(event) => setSelectedMonth(event.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          size="small"
          sx={{ width: 220 }}
        />
      </BillingHeader>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <BillingChart start={start} end={end} />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TotalJobsCard start={start} end={end} />
            </Grid>

            <Grid size={12}>
              <PaidJobsCard start={start} end={end} />
            </Grid>

            <Grid size={12}>
              <UnpaidJobsCard start={start} end={end} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BillingContainer>
  );
};
