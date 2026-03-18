import useSWRMutation from "swr/mutation";

import { extractErrorCode } from "../../services/error";
import { generateJobInvoice } from "../../services/jobs";
import { Invoice } from "../../types/types";
import { InvoiceFormValues } from "../../components/InvoiceForm/InvoiceForm";

type ErrorResponseShape = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
};

export const useGenerateInvoice = (customerId?: string, jobId?: string) => {
  const key =
    customerId && jobId
      ? (["invoice-generate", customerId, jobId] as const)
      : null;

  const { trigger, isMutating, error } = useSWRMutation<
    Invoice,
    ErrorResponseShape,
    typeof key,
    InvoiceFormValues
  >(
    key,
    async (_key, { arg }) => {
      if (!customerId || !jobId) {
        throw "INTERNAL_ERROR";
      }

      return generateJobInvoice(customerId, jobId, arg);
    },
    {
      revalidate: false,
    }
  );

  const formattedError =
    error?.response?.data?.error ??
    (error?.response?.status === 404 ? "INVOICE_NOT_FOUND" : undefined);

  return {
    generate: trigger,
    loading: isMutating,
    error: extractErrorCode(formattedError),
  };
};
