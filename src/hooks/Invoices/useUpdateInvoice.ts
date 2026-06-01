import useSWRMutation from "swr/mutation";
import { updateJobInvoice } from "../../services/invoices";
import { InvoiceFormValues } from "../../components/InvoiceForm/InvoiceForm";
import { Invoice } from "../../types/types";
import { ErrorResponseShape } from "./useGenerateInvoice";
import { extractErrorCode } from "../../services/error";

export const useUpdateInvoice = (customerId?: string, jobId?: string) => {
  const key =
    customerId && jobId
      ? (["update-invoice", customerId, jobId] as const)
      : null;
  const { trigger, isMutating, error } = useSWRMutation<
    Invoice,
    ErrorResponseShape,
    typeof key,
    InvoiceFormValues
  >(
    key,
    async ([_key, customerId, jobId], { arg }: { arg: InvoiceFormValues }) => {
      return updateJobInvoice(customerId, jobId, arg);
    }
  );

  const formattedError =
    error?.response?.data?.error ??
    (error?.response?.status === 404 ? "INVOICE_NOT_FOUND" : undefined);
  return {
    updateInvoice: trigger,
    loading: isMutating,
    error: extractErrorCode(formattedError),
  };
};
