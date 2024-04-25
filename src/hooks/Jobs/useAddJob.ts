import useSWRMutation from "swr/mutation";
import { Job } from "../../types/types";

import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { addJob } from "../../services/jobs";
import { JobFormValues } from "../../components/Jobs/JobForm/JobForm";
import { keyFunctionGenerator } from "./useCustomerJobs";

export const useAddJob = (customerId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    [string, string],
    JobFormValues,
    Job | null
  >(
    ["add-Job", customerId],
    async (_operation, { arg: formValues }) => {
      const job = await addJob(customerId, formValues);

      // modificar cache de solo un job
      await mutate<readonly [string, string], Job>(
        ["job"],
        job,

        { populateCache: true, revalidate: false }
      );

      // modificar cache de la coleccion
      await mutate<
        readonly [string, string | undefined, string | undefined],
        {
          jobs: Job[];
          nextToken?: string;
        } | null
      >(
        unstable_serialize(keyFunctionGenerator(customerId)),
        () => undefined,

        { revalidate: true, populateCache: false }
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
