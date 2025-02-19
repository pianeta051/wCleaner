import { getJobTypes } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { JobType } from "../../types/types";
import useSWR from "swr";

export const useJobTypes = () => {
  const {
    data: jobTypes,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<JobType[], Error, [string]>(["jobTypes"], async ([_operation]) =>
    getJobTypes()
  );

  return {
    jobTypes,
    error: extractErrorCode(error),
    loading,
    reload: mutate,
  };
};
