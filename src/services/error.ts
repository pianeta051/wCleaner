export const ERROR_CODES = [
  "USER_NOT_EXISTS",
  "INCORRECT_PASSWORD",
  "EMPTY_SEARCH",
  "INTERNAL_ERROR",
  "QUERY_TOO_LONG",
  "DUPLICATED_USER",
  "INVALID_PASSWORD",
  "CUSTOMER_ALREADY_EXISTS",
  "INVALID_RESET_PASSWORD_LINK",
  "TOO_MANY_TRIES",
  "UNAUTHORIZED",
] as const;
export type ErrorCode = typeof ERROR_CODES[number];
export const isErrorCode = (parameter: unknown): parameter is ErrorCode =>
  typeof parameter === "string" && ERROR_CODES.includes(parameter as ErrorCode);
