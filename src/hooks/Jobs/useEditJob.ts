import useSWRMutation from "swr/mutation";
import { editCustomerJob } from "../../services/jobs";
import { Job } from "../../types/types";

import { extractErrorCode } from "../../services/error";
import { JobFormValues } from "../../components/Jobs/JobForm/JobForm";

export const useEditJob = (
  customerId: string | undefined,
  jobId: string | undefined
) => {
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string, string] | null,
    JobFormValues
  >(
    jobId && customerId ? ["job", jobId] : null,
    async ([_operation, _operation2], { arg: formValues }) =>
      editCustomerJob(customerId as string, jobId as string, formValues),
    {
      revalidate: false,
      populateCache: true,
    }
  );

  return {
    editCustomerJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
