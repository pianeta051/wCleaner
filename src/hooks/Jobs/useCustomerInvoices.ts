import useSWR from "swr";

import { getCustomerInvoices } from "../../services/invoices";
import { extractErrorCode } from "../../services/error";
import { Invoice } from "../../types/types";
import useSWRInfinite from "swr/infinite";

type CustomerInvoicesKey = [
  string,
  string,
  string | undefined,
  boolean | undefined
];

type KeyFunction = (
  index: number,
  previousPageData: { invoices: Invoice[]; nextToken?: string } | null
) => readonly [string, string, string | undefined, boolean | undefined] | null;

export const keyFunctionGenerator: (
  customerId?: string,
  paginate?: boolean
) => KeyFunction =
  (customerId, paginate = true) =>
  (_index, previousRequest) =>
    customerId
      ? ["customer-invoices", customerId, previousRequest?.nextToken, paginate]
      : null;

export const useCustomerInvoices = (customerId?: string, paginate = true) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
    mutate,
  } = useSWRInfinite<
    { invoices: Invoice[]; nextToken?: string },
    Error,
    KeyFunction
  >(
    keyFunctionGenerator(customerId, paginate),
    async (key) => {
      const [, currentCustomerId, nextToken, paginate] =
        key as CustomerInvoicesKey;

      return getCustomerInvoices(currentCustomerId, {
        nextToken,
        disabled: !paginate,
      });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loadMore = () => setSize((size) => size + 1);

  const invoices: Invoice[] =
    data?.reduce((acc, { invoices }) => {
      return [...acc, ...invoices];
    }, [] as Invoice[]) ?? [];
  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    invoices,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
    reload: mutate,
  };
};
