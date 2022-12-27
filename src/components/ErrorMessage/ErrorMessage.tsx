import { Alert, Button, Typography } from "@mui/material";
import { FC } from "react";
import { ErrorCode } from "../../services/error";
import { Link } from "react-router-dom";

type ErrorMessageProps = {
  code: ErrorCode;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({ code }) => {
  if (code === "INCORRECT_PASSWORD") {
    return (
      <Alert severity="error">
        <Typography>Your password is not correct</Typography>
        <Link to="/forgot-password">
          <Button color="error">Forgot your password?</Button>
        </Link>
      </Alert>
    );
  }
  if (code === "USER_NOT_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>
          The email is not registered. Please contact the system administrator
        </Typography>
      </Alert>
    );
  }
  if (code === "EMPTY_SEARCH") {
    return (
      <Alert severity="warning">
        <Typography>Field Can not be empty</Typography>
      </Alert>
    );
  }

  if (code === "QUERY_TOO_LONG") {
    return (
      <Alert severity="warning">
        <Typography>Text should be under 10 character</Typography>
      </Alert>
    );
  }
  if (code === "EMAIL_NOT_REGISTERED") {
    return (
      <Alert severity="error">
        <Typography>
          The email is not registered. Please contact the system administrator
        </Typography>
      </Alert>
    );
  }

  return <Alert severity="error">Internal error</Alert>;
};
