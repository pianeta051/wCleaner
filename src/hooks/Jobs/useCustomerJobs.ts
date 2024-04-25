import { extractErrorCode } from "../../services/error";
import useSWRInfinite from "swr/infinite";
import { getCustomerJobs } from "../../services/jobs";
import { Job } from "../../types/types";

type KeyFunction = (
  index: number,
  previousPageData: {
    items: Job[];
    nextToken?: string;
  } | null
) => readonly [string, string, string | undefined];

export const keyFunctionGenerator: (customerId: string) => KeyFunction =
  (customerId: string) => (_index, previousRequest) =>
    ["customer-jobs", customerId, previousRequest?.nextToken];

export const useCustomerJobs = (customerId: string) => {
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
    keyFunctionGenerator(customerId),
    async ([_operation, customerId, nextToken]) =>
      getCustomerJobs(customerId, nextToken)
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
