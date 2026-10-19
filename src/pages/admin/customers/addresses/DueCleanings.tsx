import { FC } from "react";
import {
  Alert,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { Wrapper, Title } from "../Customers/Customers.style";

import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useDueCleaningAddresses } from "../../../../hooks/Customers/addresses/useDueCleaningAddresses";
import { AddressDueDateChip } from "../../../../components/AddressDueDateChip/AddressDueDateChip";

const getDueInfo = (dueDate: string) => {
  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  const daysRemaining = due.diff(today, "day");

  if (daysRemaining < 0) {
    const days = Math.abs(daysRemaining);

    return {
      status: "overdue" as const,
      label: `Overdue by ${days} ${days === 1 ? "day" : "days"}`,
    };
  }

  if (daysRemaining === 0) {
    return {
      status: "dueSoon" as const,
      label: "Due today",
    };
  }

  if (daysRemaining === 1) {
    return {
      status: "dueSoon" as const,
      label: "Due tomorrow",
    };
  }

  return {
    status: "dueSoon" as const,
    label: `Due in ${daysRemaining} days`,
  };
};

export const DueCleanings: FC = () => {
  const navigate = useNavigate();

  const { addresses, loading, error } = useDueCleaningAddresses();

  return (
    <Wrapper>
      <Toolbar />

      <Title>Due Cleanings</Title>

      {loading ? (
        <Grid container justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <ErrorMessage code={error} />
      ) : addresses.length === 0 ? (
        <Alert severity="success">
          There are no overdue or upcoming cleanings in the next 7 days.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {addresses.map((address) => {
            return (
              <Paper
                key={address.id}
                elevation={2}
                onClick={() =>
                  navigate(`/admin/customers/${address.customerSlug}`)
                }
                sx={{
                  p: 2.5,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: 5,
                  },
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="h6">{address.customerName}</Typography>

                    <Typography variant="body1">{address.name}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {[address.address, address.postcode]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>

                    {address.frequency && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Every {address.frequency.value} {address.frequency.unit}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "flex-end" }}
                    >
                      <AddressDueDateChip dueDate={address.dueDate} />

                      <Typography variant="body2" color="text.secondary">
                        Due {dayjs(address.dueDate).format("DD MMM YYYY")}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Wrapper>
  );
};
