import { FC } from "react";
import {
  Modal,
  Alert,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Customer } from "../../../../types/types";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";

import {
  Overlay,
  ModalBox,
  Header,
  HeaderText,
  Content,
  Footer,
  ErrorWrap,
} from "./NewCustomerModal.style";

type NewCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
  addCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  loading: boolean;
  error?: string;
};

export const NewCustomerModal: FC<NewCustomerModalProps> = ({
  open,
  onClose,
  onSubmit,
  addCustomer,
  loading,
  error,
}) => {
  const submitHandler = (formValues: CustomerFormValues) => {
    addCustomer(formValues)
      .then((customer) => onSubmit(customer))
      .catch(() => {
        // Error shown below
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="New Customer"
      aria-describedby="Create a new customer"
      disableScrollLock
    >
      <Overlay>
        <ModalBox>
          <Header>
            <HeaderText>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.1 }}
              >
                New Customer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new customer
              </Typography>
            </HeaderText>

            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Header>

          <Divider />

          <Content>
            {error && (
              <ErrorWrap>
                <Alert severity="error">{error}</Alert>
              </ErrorWrap>
            )}

            <CustomerForm
              formId="new-customer-form"
              onSubmit={submitHandler}
              onCancel={onClose}
              loading={loading}
              layout="vertical"
              enableCopyAddress
              showActions={false}
            />
          </Content>

          <Footer>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              form="new-customer-form"
              loading={loading}
              sx={{ textTransform: "none" }}
            >
              Save
            </Button>
          </Footer>
        </ModalBox>
      </Overlay>
    </Modal>
  );
};
