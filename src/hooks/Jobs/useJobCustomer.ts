import useSWR from "swr";
import { Job } from "../../types/types";
import { getJob } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";

export const useJobCustomer = (customerId?: string, jobId?: string) => {
  const { data, isLoading, error, mutate } = useSWR<
    Job | null,
    Error,
    readonly [string, string, string] | null
  >(
    customerId && jobId ? ["job", customerId, jobId] : null,
    async ([_operation, customerId, jobId]) => getJob(customerId, jobId)
  );

  return {
    job: data,
    error: extractErrorCode(error),
    loading: isLoading,
    reload: mutate,
  };
};
