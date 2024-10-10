import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";

import { deleteCustomerJob } from "../../services/jobs";
export const useDeleteJob = (customerId: string) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    string
  >(
    ["delete-customer-job", customerId],
    async (_operation, { arg: jobId }) => {
      await deleteCustomerJob(customerId, jobId);
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    deleteCustomerJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
