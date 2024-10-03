import useSWRInfinite from "swr/infinite";
import { getJobs } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { Job, JobFilters } from "../../types/types";

type KeyFunction = (
  index: number,
  previousPageData: { jobs: Job[]; nextToken?: string } | null
) => readonly [
  string,
  JobFilters,
  "desc" | "asc",
  string | undefined,
  boolean | undefined
];

export const keyFunctionGenerator: (
  filters: JobFilters,
  order?: "desc" | "asc",
  paginate?: boolean
) => KeyFunction =
  (filters: JobFilters, order: "desc" | "asc" = "asc", paginate = true) =>
  (_index, previousRequest) =>
    ["jobs", filters, order, previousRequest?.nextToken, paginate];

export const useJobs = (
  filters: JobFilters,
  order: "desc" | "asc" = "asc",
  paginate = true
) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
    mutate,
  } = useSWRInfinite<{ jobs: Job[]; nextToken?: string }, Error, KeyFunction>(
    keyFunctionGenerator(filters, order, paginate),
    async ([_operation, filters, order, nextToken, paginate]) =>
      getJobs(filters, order, { nextToken, paginate })
  );

  const loadMore = () => setSize((size) => size + 1);

  const jobs: Job[] =
    data?.reduce((acc, { jobs }) => {
      return [...acc, ...jobs];
    }, [] as Job[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    jobs,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
    reload: mutate,
  };
};
