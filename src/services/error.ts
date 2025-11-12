export const ERROR_CODES = [
  "USER_NOT_EXISTS",
  "INCORRECT_PASSWORD",
  "EMPTY_SEARCH",
  "INTERNAL_ERROR",
  "QUERY_TOO_LONG",
  "DUPLICATED_COLOR",
  "DUPLICATED_NAME",
  "DUPLICATED_USER",
  "CUSTOMER_ALREADY_EXISTS",
  "TOO_MANY_TRIES",
  "UNAUTHORIZED",
  "EXPIRED_LINK",
  "NOT_FOUND",
  "EMAIL_ALREADY_EXISTS",
  "COLOR_CANNOT_BE_EMPTY",
  "EMAIL_CANNOT_BE_EMPTY",
  "NAME_CANNOT_BE_EMPTY",
  "CUSTOMER_NOT_EXISTS",
  "CUSTOMER_NOT_FOUND",
  "REQUIRED_FIELDS",
  "JOB_NOT_EXISTS",
  "INVALID_CONFIRMATION_LINK",
  "INVALID_FILE_DATA",
  "INVALID_PASSWORD",
  "INVALID_RESET_PASSWORD_LINK",
  "USER_IS_LAST_ADMIN",
  "UPLOAD_FAILED",
  "TITLE_CANNOT_BE_EMPTY",
  "CONTENT_CANNOT_BE_EMPTY",
  "FILEURLS_MUST_BE_ARRAY",
  "ADDRESS_NAME_ALREADY_EXISTS",
  "DELETING_LAST_ADDRESS",
  "THIS_CUSTOMER_HAS_PENDING_JOBS",
  "INVOICE_NOT_FOUND",
] as const;
export type ErrorCode = typeof ERROR_CODES[number];
export const isErrorCode = (parameter: unknown): parameter is ErrorCode =>
  typeof parameter === "string" && ERROR_CODES.includes(parameter as ErrorCode);

type ErrorResponse = {
  response: {
    status: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
};

export const isErrorResponse = (value: unknown): value is ErrorResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "response" in value &&
    typeof (value as ErrorResponse)["response"] === "object" &&
    (value as ErrorResponse)["response"] != null &&
    "status" in (value as ErrorResponse)["response"] &&
    typeof (value as ErrorResponse)["response"]["status"] === "number"
  );
};

export const extractErrorCode = (error: Error | string | undefined) => {
  let errorCode: ErrorCode | null = null;
  if (typeof error === "string") {
    if (isErrorCode(error)) {
      return error;
    }
    return "INTERNAL_ERROR";
  }
  if (error) {
    errorCode = isErrorCode(error) ? error : "INTERNAL_ERROR";
  }
  return errorCode;
};
