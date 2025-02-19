import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { deleteJobType } from "../../services/jobs";

export const useDeleteJobType = (jobTypeId: string) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    string
  >(
    ["delete-job-type", jobTypeId],
    async ([_operation, jobTypeId]) => {
      await deleteJobType(jobTypeId);
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    deleteJobType: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
