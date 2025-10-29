import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Job, JobFilters, JobStatus } from "../../types/types";
import { updateJobStatus } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomerJobs";

export const useUpdateJobStatus = (
  customerId: string | undefined,
  jobId?: string | undefined
) => {
  const { mutate } = useSWRConfig();
  const filters: JobFilters = { start: "", end: "" };

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string, string, string] | null,
    JobStatus
  >(
    customerId && jobId ? ["update-job-status", customerId, jobId] : null,
    async ([_op, customerId, jobId], { arg: status }) => {
      await updateJobStatus(customerId, jobId, status);
      await mutate(
        unstable_serialize(keyFunctionGenerator(customerId, filters)),
        undefined,
        { revalidate: true, populateCache: false }
      );
    },
    { revalidate: false, populateCache: false }
  );

  return {
    updateStatus: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
