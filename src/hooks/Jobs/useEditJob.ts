import { unstable_serialize, useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { Job } from "../../types/types";
import { keyFunctionGenerator } from "./useCustomerJobs";
import { editCustomerJob } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";

export const useCustomerEditJob = (customerId?: string, jobId?: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string, string, string] | null,
    JobFormValues,
    Job[]
  >(
    customerId && jobId ? ["edit-customer-job", customerId, jobId] : null,
    async ([_operation, customerId, jobId], { arg: formValues }) => {
      const address = editCustomerJob(customerId, jobId, formValues);
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
      return address;
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
