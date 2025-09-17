import useSWRMutation from "swr/mutation";
import { Job } from "../../types/types";

import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { addJob } from "../../services/jobs";
import { JobFormValues } from "../../components/JobForm/JobForm";

export const useAddJob = (customerId?: string, addressId?: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    string,
    [string, string, string] | null,
    JobFormValues,
    Job | null
  >(
    customerId && addressId ? ["add-Job", customerId, addressId] : null,
    async ([_operation, customerId, addressId], { arg: formValues }) => {
      const job = await addJob(customerId, addressId, formValues);

      // modificar cache de solo un job
      await mutate<readonly [string, string], Job>(
        ["job"],
        job,

        { populateCache: true, revalidate: false }
      );
      return job;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    addJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
