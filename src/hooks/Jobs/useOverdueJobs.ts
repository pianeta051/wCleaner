import useSWR from "swr";
import { getOverdueJobs } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { Job } from "../../types/types";

export const useOverdueJobs = () => {
  const { data, error, isLoading, mutate } = useSWR<{
    jobs: Job[];
    total: number;
  }>(["jobs", "overdue"], getOverdueJobs);

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    error: extractErrorCode(error),
    loading: isLoading,
    reload: mutate,
  };
};
