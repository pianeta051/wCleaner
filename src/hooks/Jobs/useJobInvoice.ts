import useSWR from "swr";
import { getJobInvoice } from "../../services/jobs";
import { Invoice } from "../../types/types";
import { extractErrorCode } from "../../services/error";

export const useJobInvoice = (customerId?: string, jobId?: string) => {
  const shouldFetch = !!customerId && !!jobId;

  const { data, error, isLoading, mutate } = useSWR<Invoice>(
    shouldFetch ? ["invoice", customerId, jobId] : null,
    () => getJobInvoice(customerId as string, jobId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
    }
  );

  const formattedError =
    error?.response?.status === 404
      ? "INVOICE_NOT_FOUND"
      : error?.response?.data?.error;

  return {
    invoice: data,
    loading: isLoading,
    error: extractErrorCode(formattedError),
    reload: mutate,
  };
};
