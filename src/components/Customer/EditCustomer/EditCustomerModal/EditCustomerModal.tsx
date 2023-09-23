import { Modal } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Customer } from "../../../../types/types";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "../../CustomerForm/CustomerForm.style";
import { Grid } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import {
  deleteCustomer,
  editCustomer,
  getCustomer,
} from "../../../../services/customers";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { ErrorMessage } from "../../../ErrorMessage/ErrorMessage";
import { useParams } from "react-router-dom";

type EditCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: () => void;
  customer: Customer;
};
type EditCustomerParams = {
  id: string;
};

export const EditCustomerModal: FC<EditCustomerModalProps> = ({
  open,
  onClose,
  customer,
  onDelete,
  onEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id } = useParams<EditCustomerParams>();

  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, []);

  const submitHandler = (formValues: CustomerFormValues) => {
    setError(null);
    setLoading(true);
    editCustomer(customer.id, formValues)
      .then((customer) => {
        onEdit(customer);
      })
      .catch((error) => {
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const deleteHandler = () => {
    setLoading(true);
    deleteCustomer(customer.id)
      .then(() => {
        setLoading(false);
        onDelete();
      })
      .catch((error) => {
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Edit Customer"
      aria-describedby="Editing customer"
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">Edit Customer</Title>
          </Grid>
        </Wrapper>
        <Background>
          {error && <ErrorMessage code={error} />}
          <CustomerForm
            onCancel={onClose}
            onSubmit={submitHandler}
            onDelete={deleteHandler}
            initialValues={customer}
            loading={loading}
          />
        </Background>
      </ModalBox>
    </Modal>
  );
};
