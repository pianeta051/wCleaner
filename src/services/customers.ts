import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { Customer } from "../types/types";
import { isErrorResponse } from "./error";
import { uploadFile } from "./files";
import { NoteFormValues } from "../components/NoteForm/NoteForm";

const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number | boolean } = {}
) => {
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

// const post = async (path: string, body: { [param: string]: string } = {}) => {
//   return API.post("wCleanerApi", path, {
//     body,
//   });
// };

const post = async <TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> => {
  return API.post("wCleanerApi", path, {
    body,
  });
};

const remove = async (path: string) => {
  return API.del("wCleanerApi", path, {});
};

// const put = async (path: string, body: { [param: string]: string } = {}) => {
//   return API.put("wCleanerApi", path, {
//     body,
//   });
// };
const put = async <TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> => {
  return API.put("wCleanerApi", path, { body });
};

export const isCustomer = (value: unknown): value is Customer => {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Customer;

  const validFileUrls =
    typeof v.fileUrls === "undefined" ||
    (Array.isArray(v.fileUrls) &&
      v.fileUrls.every((item) => typeof item === "string"));

  return (
    typeof v.id === "string" && typeof v.name === "string" && validFileUrls
  );
};

export const addCustomer = async (
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    // const response = await post("/customers", formValues);
    const response = await post<CustomerFormValues, { customer: Customer }>(
      "/customers",
      formValues
    );

    if (!isCustomer(response.customer)) {
      throw "INTERNAL_ERROR";
    }
    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 409) {
        throw "EMAIL_ALREADY_EXISTS";
      }
      if (error.response.status === 400) {
        if (error.response.data?.error === "Email cannot be empty") {
          throw "EMAIL_CANNOT_BE_EMPTY";
        }
        if (error.response.data?.error === "Name cannot be empty") {
          throw "NAME_CANNOT_BE_EMPTY";
        }
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await remove("/customers/" + id);
};

export const editCustomer = async (
  id: string,
  formValues: Partial<CustomerFormValues>
): Promise<Customer> => {
  try {
    const response = await put<
      Partial<CustomerFormValues>,
      { customer: Customer }
    >(`/customers/${id}`, formValues);

    if (!isCustomer(response.customer)) {
      throw "INTERNAL_ERROR";
    }

    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 409) {
        throw "EMAIL_ALREADY_EXISTS";
      }
      if (error.response.status === 400) {
        throw "EMAIL_CANNOT_BE_EMPTY";
      }
      if (error.response.status === 404) {
        throw "CUSTOMER_NOT_EXISTS";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const getCustomers = async (
  filters: {
    searchInput?: string;
    outcodeFilter?: string[];
  },
  pagination: {
    nextToken?: string;
    disabled?: boolean;
  }
): Promise<{
  customers: Customer[];
  nextToken?: string;
}> => {
  const { searchInput, outcodeFilter } = filters;
  const { nextToken, disabled } = pagination;
  const response = await get("/customers", {
    nextToken,
    search: searchInput,
    outcodeFilter: outcodeFilter?.join(","),
    paginationDisabled: disabled,
  });

  const customers = response.customers as Customer[];
  const responseToken = response.nextToken as string | undefined;
  if (!("customers" in response) || !Array.isArray(response.customers)) {
    throw "INTERNAL_ERROR";
  }
  for (const customer of response.customers) {
    if (!isCustomer(customer)) {
      throw "INTERNAL_ERROR";
    }
  }

  return { customers, nextToken: responseToken };
};

export const getCustomer = async (slug: string): Promise<Customer> => {
  try {
    const response = await get(`/customers/${slug}`);

    if (
      typeof response !== "object" ||
      !response ||
      !("customer" in response) ||
      typeof response.customer !== "object"
    ) {
      throw "INTERNAL_ERROR";
    }

    if (!isCustomer(response.customer)) {
      throw "INTERNAL_ERROR";
    }

    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 404) {
        throw "NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await get(`/customer-by-id/${id}`);

    if (!("customer" in response) && typeof response.customer !== "object") {
      throw "INTERNAL_ERROR";
    }
    if (!isCustomer(response.customer)) {
      throw "INTERNAL_ERROR";
    }
    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 404) {
        throw "NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const getOutcodes = async (): Promise<string[]> => {
  const response = await get("/outcodes");

  if (!("outcodes" in response) || !Array.isArray(response.outcodes)) {
    throw "INTERNAL_ERROR";
  }

  const outcodes = response.outcodes as string[];

  for (const code of outcodes) {
    if (typeof code !== "string" || !code.trim()) {
      throw "INTERNAL_ERROR";
    }
  }

  return outcodes;
};

export const addFile = async (file: File, path: string): Promise<string> => {
  try {
    await uploadFile(file, path);
    return path;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error;

      if (status === 400 && message === "Invalid file type") {
        throw "INVALID_FILE_TYPE";
      }
      if (status === 413) {
        throw "FILE_TOO_LARGE";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const replaceCustomerFiles = async (
  customerId: string,
  fileUrls: string[]
): Promise<{ fileUrls: string[]; id: string }> => {
  try {
    const response = await put<
      { fileUrls: string[] },
      { customer: { fileUrls: string[]; id: string } }
    >(`/customers/${customerId}/files`, { fileUrls });

    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error;

      if (status === 400 && message === "Invalid file data") {
        throw "INVALID_FILE_DATA";
      }
      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

//CUSTOMER NOTES

export const addCustomerNote = async (
  customerId: string,
  formValues: NoteFormValues
): Promise<void> => {
  try {
    await post(`/customers/${customerId}/note`, formValues);
  } catch (error) {
    if (isErrorResponse(error)) {
      const { status, data } = error.response;

      if (status === 400) {
        if (data?.error === "Title cannot be empty") {
          throw "TITLE_CANNOT_BE_EMPTY";
        }
        if (data?.error === "Content cannot be empty") {
          throw "CONTENT_CANNOT_BE_EMPTY";
        }
      }

      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const editCustomerNote = async (
  customerId: string,
  noteId: string,
  formValues: NoteFormValues
): Promise<void> => {
  try {
    await put(`/customers/${customerId}/note/${noteId}`, formValues);
  } catch (error) {
    if (isErrorResponse(error)) {
      const { status, data } = error.response;

      if (status === 400) {
        if (data?.error === "Title cannot be empty") {
          throw "TITLE_CANNOT_BE_EMPTY";
        }
        if (data?.error === "Content cannot be empty") {
          throw "CONTENT_CANNOT_BE_EMPTY";
        }
      }

      if (status === 404) {
        if (data?.error === "The customer does not exist") {
          throw "CUSTOMER_NOT_FOUND";
        }
        if (data?.error === "The note does not exist") {
          throw "NOTE_NOT_FOUND";
        }
      }
    }

    throw "INTERNAL_ERROR";
  }
};
export const deleteCustomerNote = async (
  customerId: string,
  noteId: string
): Promise<void> => {
  try {
    await remove(`/customers/${customerId}/note/${noteId}`);
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};
