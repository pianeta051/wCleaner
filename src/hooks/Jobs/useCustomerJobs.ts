import { extractErrorCode } from "../../services/error";
import useSWRInfinite from "swr/infinite";
import { getCustomerJobs } from "../../services/jobs";
import { Job, JobFilters } from "../../types/types";

type KeyFunction = (
  index: number
) => readonly [string, string, JobFilters, "desc" | "asc"];

export const keyFunctionGenerator: (
  customerId: string,
  filters: JobFilters,
  order?: "desc" | "asc"
) => KeyFunction =
  (customerId: string, filters: JobFilters, order: "desc" | "asc" = "asc") =>
  (_index) =>
    ["customer-jobs", customerId, filters, order];

export const useCustomerJobs = (
  customerId: string,
  filters: JobFilters,
  order: "desc" | "asc" = "asc"
) => {
  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWRInfinite<
    {
      items: Job[];
    },
    Error,
    KeyFunction
  >(
    keyFunctionGenerator(customerId, filters, order),
    async ([_operation, customerId, filters, order]) =>
      getCustomerJobs(customerId, filters, order)
  );

  const customerJobs: Job[] =
    data?.reduce((acc, { items }) => {
      return [...acc, ...items];
    }, [] as Job[]) ?? [];

  return {
    customerJobs,
    error: extractErrorCode(error),
    loading,
    reload: mutate,
  };
};
