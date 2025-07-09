import { Alert, Button, Typography } from "@mui/material";
import { FC } from "react";
import { ErrorCode } from "../../services/error";
import { Link } from "react-router-dom";
import { NotFound } from "../../pages/NotFound/NotFound";

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
  if (code === "EMAIL_ALREADY_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>
          There is an existing customer with this email. Please try with other
          email.
        </Typography>
      </Alert>
    );
  }
  if (code === "EMAIL_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Email field cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "CUSTOMER_NOT_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>This Customer does not exists</Typography>
      </Alert>
    );
  }
  if (code === "FILEURLS_MUST_BE_ARRAY") {
    return (
      <Alert severity="error">
        <Typography>Error in the File Url</Typography>
      </Alert>
    );
  }

  if (code === "NOT_FOUND") {
    return <NotFound />;
  }

  if (code === "NAME_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Name field cannot be empty</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_CONFIRMATION_LINK") {
    return (
      <Alert severity="error">
        <Typography>
          Your confirmation link is invalid, please contact a site admin
        </Typography>
      </Alert>
    );
  }
  if (code === "USER_IS_LAST_ADMIN") {
    return (
      <Alert severity="error">
        <Typography>
          User cannot be removed from group Admin because it&apos;s the last one
        </Typography>
      </Alert>
    );
  }
  if (code === "DUPLICATED_COLOR") {
    return (
      <Alert severity="error">
        <Typography>Color cannot be duplicated</Typography>
      </Alert>
    );
  }
  if (code === "DUPLICATED_NAME") {
    return (
      <Alert severity="error">
        <Typography>Name cannot be duplicated</Typography>
      </Alert>
    );
  }
  if (code === "UPLOAD_FAILED") {
    return (
      <Alert severity="error">
        <Typography>Upload Failed</Typography>
      </Alert>
    );
  }
  if (code === "TITLE_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Title cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "CONTENT_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Content cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_FILE_DATA") {
    return (
      <Alert severity="error">
        <Typography>Invalid Data File, please contact a site admin</Typography>
      </Alert>
    );
  }
  if (code === "INTERNAL_ERROR") {
    return (
      <Alert severity="error">
        <Typography>Internal error</Typography>
      </Alert>
    );
  }
  return <Alert severity="error">Internal error</Alert>;
};
