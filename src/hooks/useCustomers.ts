import useSWRInfinite from "swr/infinite";
import { getCustomers } from "../services/customers";
import { extractErrorCode } from "../services/error";
import { Customer } from "../types/types";

type KeyFunctionType = (
  index: number,
  previousPageData: {
    customers: Customer[];
    nextToken?: string;
  } | null
) => readonly [string, string | undefined, string | undefined];

export const keyFunctionGenerator: (searchInput?: string) => KeyFunctionType =
  (searchInput?: string) => (_index, previousRequest) =>
    ["customers", previousRequest?.nextToken, searchInput];

export const useCustomers = (searchInput?: string) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    {
      customers: Customer[];
      nextToken?: string;
    },
    Error,
    KeyFunctionType
  >(
    keyFunctionGenerator(searchInput),
    async ([_operation, nextToken, searchInput]) => {
      console.log([_operation, nextToken, searchInput]);
      return getCustomers(nextToken, searchInput);
    }
  );

  const loadMore = () => setSize((size) => size + 1);

  const customers: Customer[] =
    data?.reduce((acc, { customers }) => {
      return [...acc, ...customers];
    }, [] as Customer[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    customers,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
  };
};
