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
  if (code === "DUPLICATED_USER") {
    return (
      <Alert severity="error">
        <Typography>User already exists!</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_PASSWORD") {
    return (
      <Alert severity="error">
        <Typography>Invalid Password</Typography>
      </Alert>
    );
  }
  if (code === "CUSTOMER_ALREADY_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>Already customer registered with this email.</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_RESET_PASSWORD_LINK") {
    return (
      <Alert severity="error">
        <Typography>This Reset password link in invalid.</Typography>
      </Alert>
    );
  }
  if (code === "TOO_MANY_TRIES") {
    return (
      <Alert severity="error">
        <Typography>
          You tried this too many times. Please try again later.
        </Typography>
      </Alert>
    );
  }
  if (code === "UNAUTHORIZED") {
    return (
      <Alert severity="error">
        <Typography>
          Access denied. You are not authorized on this page
        </Typography>
      </Alert>
    );
  }
  if (code === "EXPIRED_LINK") {
    return (
      <Alert severity="error">
        <Typography>Your reset link has expired. Please try again</Typography>
      </Alert>
    );
  }

  return <Alert severity="error">Internal error</Alert>;
};
