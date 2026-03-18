import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

import { getInvoices } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { InvoiceWithAddress } from "../../types/types";

type InvoicesResponse = {
  invoices: InvoiceWithAddress[];
  nextToken?: string;
};

type ErrorResponseShape = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
};

type InvoicesKey = readonly [string, string | undefined];

export const useInvoicesInfinite = () => {
  const getKey = (
    pageIndex: number,
    previousPageData: InvoicesResponse | null
  ): InvoicesKey | null => {
    if (pageIndex === 0) {
      return ["invoices", undefined] as const;
    }

    if (!previousPageData?.nextToken) {
      return null;
    }

    return ["invoices", previousPageData.nextToken] as const;
  };

  const { data, error, isLoading, mutate, setSize, isValidating } =
    useSWRInfinite<InvoicesResponse, ErrorResponseShape>(
      getKey,
      (key) => {
        const [, nextToken] = key as InvoicesKey;

        return getInvoices({ nextToken });
      },
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

  const invoices = useMemo(
    () => data?.flatMap((page) => page.invoices) ?? [],
    [data]
  );

  const lastPage = data?.[data.length - 1];
  const hasMore = !!lastPage?.nextToken;
  const loadingMore = isValidating && !isLoading;

  const formattedError =
    error?.response?.data?.error ??
    (error?.response?.status === 403 ? "UNAUTHORIZED" : undefined);

  return {
    invoices,
    loading: isLoading,
    loadingMore,
    error: extractErrorCode(formattedError),
    reload: mutate,
    hasMore,
    loadMore: () => setSize((currentSize) => currentSize + 1),
  };
};
