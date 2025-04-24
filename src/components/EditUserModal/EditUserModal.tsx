import { Grid, Modal } from "@mui/material";
import { FC, useState } from "react";

import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { UserForm, UserFormValues } from "../UserForm/UserForm";
import {
  Background,
  ModalContent,
  Title,
  Wrapper,
} from "./EditUserModal.style";
import { updateUser, User } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export const EditUserModal: FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const [loading, setLoading] = useState(false);
  const submitHandler = (values: UserFormValues) => {
    setLoading(true);
    updateUser(user.id, values)
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const initialValues: UserFormValues = {
    email: user.email,
    password: "",
    color: user.color ?? "#f44336",
    name: user.name ?? "",
  };

  const closeHandler = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={closeHandler}>
      <ModalContent>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">Edit User</Title>
          </Grid>
        </Wrapper>

        <Background>
          <UserForm
            onSubmit={submitHandler}
            initialValues={initialValues}
            loading={loading}
            isUpdate
          />
        </Background>
        {error && <ErrorMessage code={error} />}
      </ModalContent>
    </Modal>
  );
};
