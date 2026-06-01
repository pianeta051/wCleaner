import useSWR from "swr";
import { useMemo } from "react";

import { getJobInvoice } from "../../services/invoices";
import { Invoice } from "../../types/types";
import { extractErrorCode } from "../../services/error";

type ErrorResponseShape = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
};

export const useJobInvoice = (customerId?: string, jobId?: string) => {
  const shouldFetch = useMemo(
    () => !!customerId && !!jobId,
    [customerId, jobId]
  );

  const key = useMemo(
    () => (shouldFetch ? ["invoice", customerId, jobId] : null),
    [shouldFetch, customerId, jobId]
  );

  const { data, error, isLoading, mutate } = useSWR<
    Invoice,
    ErrorResponseShape
  >(key, () => getJobInvoice(customerId as string, jobId as string), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

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
