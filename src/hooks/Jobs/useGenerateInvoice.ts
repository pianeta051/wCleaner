import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { generateJobInvoice } from "../../services/jobs";
import { Invoice } from "../../types/types";
import { InvoiceFormValues } from "../../components/InvoiceForm/InvoiceForm";

export const useGenerateInvoice = (customerId?: string, jobId?: string) => {
  const key =
    customerId && jobId
      ? (["invoice-generate", customerId, jobId] as const)
      : null;

  const { trigger, isMutating, error } = useSWRMutation<
    Invoice,
    unknown,
    typeof key,
    InvoiceFormValues
  >(
    key,
    async (_key, { arg }) => {
      if (!customerId || !jobId) throw "INTERNAL_ERROR";
      return generateJobInvoice(customerId, jobId, arg);
    },
    {
      revalidate: false,
    }
  );

  const formatted =
    // @ts-expect-error axios shape
    error?.response?.data?.error ??
    // @ts-expect-error axios shape
    (error?.response?.status === 404 ? "INVOICE_NOT_FOUND" : undefined);

  return {
    generate: trigger,
    loading: isMutating,
    error: extractErrorCode(formatted),
  };
};
