import useSWR from "swr";
import { getJobInvoice } from "../../services/jobs";
import { Invoice } from "../../types/types";
import { extractErrorCode } from "../../services/error";
import { useMemo } from "react";

export const useJobInvoice = (customerId?: string, jobId?: string) => {
  const shouldFetch = useMemo(
    () => !!customerId && !!jobId,
    [customerId, jobId]
  );

  const key = useMemo(
    () => (shouldFetch ? ["invoice", customerId, jobId] : null),
    [shouldFetch]
  );

  const { data, error, isLoading, mutate } = useSWR<Invoice>(
    key,
    () => getJobInvoice(customerId as string, jobId as string),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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
