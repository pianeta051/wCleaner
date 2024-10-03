import useSWR from "swr";
import { Job } from "../../types/types";
import { getJob } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";

export const useJobCustomer = (id: string | undefined) => {
  const { data, isLoading, error } = useSWR<
    Job | null,
    Error,
    readonly [string, string] | null
  >(id ? ["job", id] : null, async ([_operation, id]) => getJob(id));

  return {
    job: data,
    error: extractErrorCode(error),
    loading: isLoading,
  };
};
