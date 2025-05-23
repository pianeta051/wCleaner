import useSWRInfinite from "swr/infinite";
import { getCustomers } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { Customer } from "../../types/types";

type KeyFunctionType = (
  index: number,
  previousPageData: {
    customers: Customer[];
    nextToken?: string;
  } | null
) => readonly [
  string,
  string | undefined,
  string | undefined,
  string[] | undefined,
  boolean
];

export const keyFunctionGenerator: (
  searchInput?: string,
  outcodeFilter?: string[],
  disablePagination?: boolean
) => KeyFunctionType =
  (searchInput, outcodeFilter, disablePagination) =>
  (_index, previousRequest) =>
    [
      "customers",
      previousRequest?.nextToken,
      searchInput,
      outcodeFilter,
      !!disablePagination,
    ];

export const useCustomers = (
  searchInput?: string,
  outcodeFilter?: string[],
  disablePagination?: boolean
) => {
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
    keyFunctionGenerator(searchInput, outcodeFilter, disablePagination),
    async ([
      _operation,
      nextToken,
      searchInput,
      outcodeFilter,
      disablePagination,
    ]) => {
      return getCustomers(
        { searchInput, outcodeFilter },
        { nextToken, disabled: disablePagination }
      );
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
