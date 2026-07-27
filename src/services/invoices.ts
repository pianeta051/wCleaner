import { API_URL, get, localFetch, post, put, remove } from "./dataApi";
import { Invoice, InvoiceWithAddress } from "../types/types";
import { InvoiceFormValues } from "../components/InvoiceForm/InvoiceForm";
import { isErrorResponse } from "./error";
import {
  SortableColumnId,
  SortDirection,
} from "../pages/admin/invoices/InvoicesList/InvoicesList";

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
  formValues: InvoiceFormValues & {
    invoiceNumber?: string;
    firstInvoiceNumber?: number;
  }
): Promise<Invoice> => {
  try {
    const payload = {
      date: formValues.date?.valueOf(),
      description: formValues.description.trim(),
      addressId: formValues.addressId,
      ...(formValues.invoiceNumber?.trim()
        ? {
            invoiceNumber: formValues.invoiceNumber.trim().toUpperCase(),
          }
        : {}),
      ...(formValues.firstInvoiceNumber !== undefined
        ? {
            firstInvoiceNumber: formValues.firstInvoiceNumber,
          }
        : {}),
    };

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
        if (code === "FIRST_INVOICE_NUMBER_REQUIRED") {
          throw "FIRST_INVOICE_NUMBER_REQUIRED";
        }

        if (code === "INVALID_FIRST_INVOICE_NUMBER") {
          throw "INVALID_FIRST_INVOICE_NUMBER";
        }

        if (code === "INVOICE_ALREADY_EXISTS") {
          throw "INVOICE_ALREADY_EXISTS";
        }

        if (code === "INVOICE_NUMBER_IN_USE") {
          throw "INVOICE_NUMBER_IN_USE";
        }

        if (code === "INVOICE_NUMBER_OUT_OF_RANGE") {
          throw "INVOICE_NUMBER_OUT_OF_RANGE";
        }

        if (code === "INVALID_INVOICE_NUMBER") {
          throw "INVALID_INVOICE_NUMBER";
        }

        if (code === "MISSING_INVOICE_DATE") {
          throw "MISSING_INVOICE_DATE";
        }

        if (code === "MISSING_INVOICE_DESCRIPTION") {
          throw "MISSING_INVOICE_DESCRIPTION";
        }

        if (code === "MISSING_INVOICE_ADDRESS") {
          throw "MISSING_INVOICE_ADDRESS";
        }
      }

      if (status === 403) {
        throw "UNAUTHORIZED";
      }

      if (status === 404 && code === "CUSTOMER_NOT_FOUND") {
        throw "CUSTOMER_NOT_FOUND";
      }

      if (status === 404 && code === "JOB_NOT_FOUND") {
        throw "JOB_NOT_FOUND";
      }
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
    paid?: boolean;
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

    if (params?.filters?.paid !== undefined) {
      queryParams.paid = String(params.filters.paid);
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

export const getCustomerInvoices = async (
  customerId: string,
  pagination: {
    nextToken?: string;
    disabled?: boolean;
  }
): Promise<{ invoices: Invoice[]; nextToken?: string }> => {
  try {
    const { nextToken, disabled } = pagination;
    const response = await get(`/customers/${customerId}/invoices`, {
      nextToken,
      paginationDisabled: disabled,
    });

    const invoices = response.invoices as Invoice[];
    const responseToken = response.nextToken as string | undefined;

    if (!Array.isArray(invoices) || !invoices.every(isInvoice)) {
      throw "INTERNAL_ERROR";
    }

    return { invoices, nextToken: responseToken };
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;

      if (status === 403) {
        throw "UNAUTHORIZED";
      }

      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
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

export const updateJobInvoice = async (
  customerId: string,
  jobId: string,
  formValues: InvoiceFormValues
): Promise<Invoice> => {
  try {
    const response = await put(
      `/customers/${customerId}/jobs/${jobId}/invoice/`,
      { ...formValues, date: formValues.date?.valueOf() }
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
    }

    throw "INTERNAL_ERROR";
  }
};
