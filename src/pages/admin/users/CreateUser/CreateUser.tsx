import { Box, Container, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { createUser } from "../../../../services/authentication";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import {
  UserForm,
  UserFormValues,
} from "../../../../components/UserForm/UserForm";

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

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 3, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" fontWeight={900} gutterBottom align="center">
        Create User
      </Typography>

      {error && <ErrorMessage code={error} />}

      <Box sx={{ width: "100%", mt: 2 }}>
        <UserForm loading={loading} onSubmit={submitHandler} />
      </Box>
    </Container>
  );
};
