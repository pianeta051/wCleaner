import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { Customer } from "../types/types";
import { isErrorResponse } from "./error";

const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number | boolean } = {}
) => {
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (path: string, body: { [param: string]: string } = {}) => {
  return API.post("wCleanerApi", path, {
    body,
  });
};

const remove = async (path: string) => {
  return API.del("wCleanerApi", path, {});
};

const put = async (path: string, body: { [param: string]: string } = {}) => {
  return API.put("wCleanerApi", path, {
    body,
  });
};

export const isCustomer = (value: unknown): value is Customer => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Customer)["id"] === "string" &&
    "name" in value &&
    typeof (value as Customer)["name"] === "string" &&
    "email" in value &&
    typeof (value as Customer)["email"] === "string" &&
    "slug" in value &&
    typeof (value as Customer)["slug"] === "string"
  );
};

export const addCustomer = async (
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await post("/customers", formValues);
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
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await put("/customers/" + id, formValues);
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
