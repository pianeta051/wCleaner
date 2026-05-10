import { API } from "aws-amplify";
import { API_URL, localFetch } from "./dataApi";
import { Invoice, InvoiceWithAddress } from "../types/types";
import { InvoiceFormValues } from "../components/InvoiceForm/InvoiceForm";
import { isErrorResponse } from "./error";
import {
  SortableColumnId,
  SortDirection,
} from "../pages/admin/invoices/InvoicesList/InvoicesList";

// GENERAL FUNCTIONS
const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number } = {}
) => {
  if (API_URL) return localFetch("GET", path, { queryParams });
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (path: string, body: { [param: string]: unknown } = {}) => {
  if (API_URL) return localFetch("POST", path, { body });
  return API.post("wCleanerApi", path, {
    body,
  });
};

const remove = async (path: string) => {
  if (API_URL) return localFetch("DELETE", path);
  return API.del("wCleanerApi", path, {});
};

const put = async (path: string, body: { [param: string]: unknown } = {}) => {
  if (API_URL) return localFetch("PUT", path, { body });
  return API.put("wCleanerApi", path, {
    body,
  });
};

const isInvoice = (value: unknown): value is Invoice => {
  if (!value) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  const invoiceValue = value as Invoice;

  if (
    invoiceValue.paid !== undefined &&
    typeof invoiceValue.paid !== "boolean"
  ) {
    return false;
  }

  if (!invoiceValue.jobId || typeof invoiceValue.jobId !== "string") {
    return false;
  }

  if (
    !invoiceValue.invoiceNumber ||
    typeof invoiceValue.invoiceNumber !== "string"
  ) {
    return false;
  }

  if (invoiceValue.invoiceNumberRaw !== undefined) {
    if (typeof invoiceValue.invoiceNumberRaw !== "number") {
      return false;
    }
  }

  if (typeof invoiceValue.date !== "number") {
    return false;
  }

  if (typeof invoiceValue.description !== "string") {
    return false;
  }

  if (!invoiceValue.addressId || typeof invoiceValue.addressId !== "string") {
    return false;
  }

  if (invoiceValue.customerId !== undefined) {
    if (typeof invoiceValue.customerId !== "string") {
      return false;
    }
  }

  return true;
};

export const generateJobInvoice = async (
  customerId: string,
  jobId: string,
  formValues: InvoiceFormValues & { invoiceNumber?: string }
): Promise<Invoice> => {
  try {
    const payload: Record<string, unknown> = {
      ...formValues,
      date: formValues.date?.valueOf(),
      description: formValues.description.trim(),
      addressId: formValues.addressId,
    };

    if (formValues.invoiceNumber?.trim()) {
      payload.invoiceNumber = formValues.invoiceNumber.trim().toUpperCase();
    }

    const response = await post(
      `/customers/${customerId}/jobs/${jobId}/invoice`,
      payload
    );

    if (!isInvoice(response.invoice)) {
      throw "INTERNAL_ERROR";
    }

    return response.invoice;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      const code = error.response.data?.error;

      if (status === 400) {
        if (code === "INVOICE_ALREADY_EXISTS") throw "INVOICE_ALREADY_EXISTS";
        if (code === "INVOICE_NUMBER_IN_USE") throw "INVOICE_NUMBER_IN_USE";
        if (code === "INVOICE_NUMBER_OUT_OF_RANGE")
          throw "INVOICE_NUMBER_OUT_OF_RANGE";
        if (code === "INVALID_INVOICE_NUMBER") throw "INVALID_INVOICE_NUMBER";
        if (code === "MISSING_INVOICE_DATE") throw "MISSING_INVOICE_DATE";
        if (code === "MISSING_INVOICE_DESCRIPTION")
          throw "MISSING_INVOICE_DESCRIPTION";
        if (code === "MISSING_INVOICE_ADDRESS") throw "MISSING_INVOICE_ADDRESS";
      }

      if (status === 403) throw "UNAUTHORIZED";
      if (status === 404 && code === "CUSTOMER_NOT_FOUND")
        throw "CUSTOMER_NOT_FOUND";
      if (status === 404 && code === "JOB_NOT_FOUND") throw "JOB_NOT_FOUND";
    }

    throw "INTERNAL_ERROR";
  }
};

export const deleteJobInvoice = async (
  customerId: string,
  jobId: string
): Promise<void> => {
  try {
    await remove(`/customers/${customerId}/jobs/${jobId}/invoice`);
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 403) throw "UNAUTHORIZED";
      if (status === 404) throw "INVOICE_NOT_FOUND";
    }
    throw "INTERNAL_ERROR";
  }
};

export const getJobInvoice = async (
  customerId: string,
  jobId: string
): Promise<Invoice> => {
  try {
    const response = await get(
      `/customers/${customerId}/jobs/${jobId}/invoice`
    );

    if (!isInvoice(response.invoice)) {
      throw "INTERNAL_ERROR";
    }

    return response.invoice;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      const code = error.response.data?.error;

      if (status === 404 && code === "INVOICE_NOT_FOUND") {
        throw "INVOICE_NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

//GET INVOIVES
export type InvoicesListParams = {
  sorting?: {
    sortBy: SortableColumnId;
    direction: SortDirection;
  };
  filters?: {
    from?: number;
    to?: number;
  };
};

export const getInvoices = async ({
  nextToken,
  paginate = true,
  params,
}: {
  nextToken?: string;
  paginate?: boolean;
  params?: InvoicesListParams;
} = {}): Promise<{ invoices: InvoiceWithAddress[]; nextToken?: string }> => {
  try {
    const queryParams: { [param: string]: string } = {
      paginate: paginate === false ? "false" : "true",
    };

    if (params?.sorting) {
      queryParams.sortBy = params.sorting.sortBy;
      queryParams.sortDirection = params.sorting.direction;
    }

    if (params?.filters?.from !== undefined) {
      queryParams.from = String(params.filters.from);
    }

    if (params?.filters?.to !== undefined) {
      queryParams.to = String(params.filters.to);
    }

    if (nextToken) {
      queryParams.nextToken = nextToken;
    }

    const response = await get("/invoices", queryParams);

    if (
      !Array.isArray(response.invoices) ||
      !response.invoices.every(isInvoice)
    ) {
      throw "INTERNAL_ERROR";
    }

    return {
      invoices: response.invoices,
      nextToken: response.nextToken,
    };
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;

      if (status === 403) {
        throw "UNAUTHORIZED";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const updateJobInvoicePaid = async (
  customerId: string,
  jobId: string,
  paid: boolean
): Promise<Invoice> => {
  try {
    const response = await put(
      `/customers/${customerId}/jobs/${jobId}/invoice/paid`,
      { paid }
    );

    if (!isInvoice(response.invoice)) {
      throw "INTERNAL_ERROR";
    }

    return response.invoice;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      const code = error.response.data?.error;

      if (status === 403) throw "UNAUTHORIZED";
      if (status === 404 && code === "INVOICE_NOT_FOUND") {
        throw "INVOICE_NOT_FOUND";
      }
      if (status === 400 && code === "INVALID_PAID_VALUE") {
        throw "INVALID_PAID_VALUE";
      }
    }

    throw "INTERNAL_ERROR";
  }
};
