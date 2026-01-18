import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { createUser } from "../../../../services/authentication";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import {
  UserForm,
  UserFormValues,
} from "../../../../components/UserForm/UserForm";
import { FormWrap, PageContainer, Title } from "./CreateUser.style";

export const CreateUserPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const submitHandler = (formValues: UserFormValues) => {
    setLoading(true);
    setError(null);
    createUser(formValues)
      .then(() => {
        setLoading(false);
        navigate("/admin/users/");
      })
      .catch((err) => {
        setLoading(false);
        if (isErrorCode(err)) setError(err);
        else setError("INTERNAL_ERROR");
      });
  };

  const cancelHandler = () => {
    navigate("/admin/users/");
  };

  return (
    <PageContainer maxWidth="md">
      <Title variant="h3" gutterBottom>
        Create User
      </Title>

      {error && <ErrorMessage code={error} />}

      <FormWrap>
        <UserForm
          loading={loading}
          onCancel={cancelHandler}
          onSubmit={submitHandler}
        />
      </FormWrap>
    </PageContainer>
  );
};
