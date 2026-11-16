import { extractErrorCode } from "../../services/error";
import useSWRInfinite from "swr/infinite";
import { getCustomerJobs } from "../../services/jobs";
import { Job, JobFilters } from "../../types/types";

type CustomerJobsResponse = {
  items: Job[];
  nextToken?: string;
};

type CustomerJobsKey = readonly [
  "customer-jobs",
  string,
  JobFilters,
  "desc" | "asc",
  string | undefined
];

export const keyFunctionGenerator = (
  customerId: string,
  filters: JobFilters,
  order: "desc" | "asc" = "asc"
) => {
  return (
    pageIndex: number,
    previousPageData: CustomerJobsResponse | null
  ): CustomerJobsKey | null => {
    if (previousPageData && !previousPageData.nextToken) {
      return null;
    }

    return [
      "customer-jobs",
      customerId,
      filters,
      order,
      pageIndex === 0 ? undefined : previousPageData?.nextToken,
    ];
  };
};
export const useCustomerJobs = (
  customerId: string,
  filters: JobFilters,
  order: "desc" | "asc" = "asc"
) => {
  const getKey = keyFunctionGenerator(customerId, filters, order);

  const {
    data,
    error,
    isLoading: loading,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<CustomerJobsResponse, Error, typeof getKey>(
    getKey,
    async ([
      _operation,
      customerId,
      filters,
      order,
      nextToken,
    ]: CustomerJobsKey) =>
      getCustomerJobs(customerId, filters, order, nextToken),
    {
      keepPreviousData: true,
      revalidateFirstPage: true,
    }
  );

  const customerJobs: Job[] = data?.flatMap((page) => page.items) ?? [];

  const lastPage = data?.[data.length - 1];

  const moreToLoad =
    typeof lastPage?.nextToken === "string" && lastPage.nextToken.length > 0;

  const loadingMore = isValidating && !!data && size > 0;

  const loadMore = () => {
    if (!moreToLoad || loadingMore) return;

    setSize((currentSize) => currentSize + 1);
  };

  return {
    customerJobs,
    error: extractErrorCode(error),
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
    reload: mutate,
  };
};
