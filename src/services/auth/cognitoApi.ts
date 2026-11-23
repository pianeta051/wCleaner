type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

// An error response from Cognito. `name` is Cognito's error type
// (`NotAuthorizedException`, `CodeMismatchException`, ...), which is what the
// rest of the app maps to its own error codes.
export class CognitoApiError extends Error {
  readonly status: number;

  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export type CognitoApi = {
  call<T = Record<string, never>>(
    action: string,
    body: Record<string, unknown>
  ): Promise<T>;
};

const errorName = (type: unknown): string =>
  typeof type === "string" && type ? type.split("#").pop() || type : "Error";

export const createCognitoApi = ({
  region,
  fetchFn = (input, init) => fetch(input, init),
}: {
  region: string;
  fetchFn?: FetchFn;
}): CognitoApi => ({
  async call<T>(action: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetchFn(
      `https://cognito-idp.${region}.amazonaws.com/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": `AWSCognitoIdentityProviderService.${action}`,
        },
        body: JSON.stringify(body),
      }
    );
    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // Not JSON: handled below if the response is an error.
    }
    if (!response.ok) {
      const message = data.message ?? data.Message;
      throw new CognitoApiError(
        errorName(data.__type),
        typeof message === "string" ? message : response.statusText,
        response.status
      );
    }
    return data as T;
  },
});
