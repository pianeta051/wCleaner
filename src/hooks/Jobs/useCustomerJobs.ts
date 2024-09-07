import { extractErrorCode } from "../../services/error";
import useSWRInfinite from "swr/infinite";
import { getCustomerJobs } from "../../services/jobs";
import { Job, JobFilters } from "../../types/types";

type KeyFunction = (
  index: number,
  previousPageData: {
    items: Job[];
    nextToken?: string;
  } | null
) => readonly [string, string, JobFilters, "desc" | "asc", string | undefined];

export const keyFunctionGenerator: (
  customerId: string,
  filters: JobFilters,
  order?: "desc" | "asc"
) => KeyFunction =
  (customerId: string, filters: JobFilters, order: "desc" | "asc" = "asc") =>
  (_index, previousRequest) =>
    ["customer-jobs", customerId, filters, order, previousRequest?.nextToken];

export const useCustomerJobs = (
  customerId: string,
  filters: JobFilters,
  order: "desc" | "asc" = "asc"
) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    {
      items: Job[];
      nextToken?: string;
    },
    Error,
    KeyFunction
  >(
    keyFunctionGenerator(customerId, filters, order),
    async ([_operation, customerId, filters, order, nextToken]) =>
      getCustomerJobs(customerId, filters, nextToken, order)
  );

  const customerJobs: Job[] =
    data?.reduce((acc, { items }) => {
      return [...acc, ...items];
    }, [] as Job[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  const loadMore = () => setSize((size) => size + 1);

  return {
    customerJobs,
    error: extractErrorCode(error),
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
  };
};
