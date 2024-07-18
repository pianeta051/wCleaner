import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { Job } from "../../types/types";
import { editCustomerJob } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";
import { keyFunctionGenerator } from "./useCustomerJobs";

export const useCustomerEditJob = (
  customerId: string | undefined,
  jobId?: string | undefined
) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string, string, string] | null,
    JobFormValues
  >(
    customerId && jobId ? ["edit-customer-job", customerId, jobId] : null,
    async ([_operation, customerId, jobId], { arg: formValues }) => {
      const job = await editCustomerJob(customerId, jobId, formValues);
      await mutate<
        readonly [string, string, string | undefined],
        {
          items: Job[];
          nextToken?: string;
        } | null
      >(
        // Temporary solution: https://github.com/vercel/swr/issues/1156
        unstable_serialize(keyFunctionGenerator(customerId)),
        () => undefined,
        {
          revalidate: true,
          populateCache: false,
        }
      );
      return job;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    editCustomerJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
