import useSWR from "swr";
import { getJobInvoice } from "../../services/jobs";
import { Invoice } from "../../types/types";

export const useJobInvoice = (customerId?: string, jobId?: string) => {
  const shouldFetch = !!customerId && !!jobId;

  const { data, error, isLoading, mutate } = useSWR<Invoice>(
    shouldFetch ? ["invoice", customerId, jobId] : null,
    () => getJobInvoice(customerId as string, jobId as string)
  );

  const formattedError =
    error?.response?.status === 404
      ? "INVOICE_NOT_FOUND"
      : error?.response?.data?.error;

  return {
    invoice: data,
    loading: isLoading,
    error: formattedError,
    reload: mutate,
  };
};
