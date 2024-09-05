import { Job } from "../../types/types";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { deleteCustomerJob } from "../../services/jobs";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomerJobs";
export const useDeleteJob = (customerId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    string
  >(
    ["delete-customer-job", customerId],
    async (_operation, { arg: jobId }) => {
      await deleteCustomerJob(customerId, jobId);
      // await mutate<
      //   readonly [string, string, string | undefined],
      //   {
      //     items: Job[];
      //     nextToken?: string;
      //   } | null
      // >(unstable_serialize(keyFunctionGenerator(customerId)), () => undefined, {
      //   revalidate: true,
      //   populateCache: false,
      // });
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
