import { Alert, Button } from "@mui/material";
import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { GridNoCustomer } from "./EmptyCustomers.style";

type EmptyCustomersProps = {
  onCreateNew: () => void;
};

export const EmptyCustomers: FC<EmptyCustomersProps> = ({ onCreateNew }) => {
  return (
    <>
      <Alert severity="warning">No customers found</Alert>

      <GridNoCustomer>
        Create your first customer in the following button
      </GridNoCustomer>

      <Button
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        variant="contained"
        size="large"
        sx={{ marginBottom: 2 }}
      >
        Create your first customer
      </Button>
    </>
  );
};
