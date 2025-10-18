import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { unstable_serialize } from "swr/infinite";
import dayjs from "dayjs";

import { editCustomerJob, getCustomerJobs, getJob } from "../../services/jobs";
import { Job, JobFilters } from "../../types/types";
import { extractErrorCode } from "../../services/error";
import { keyFunctionGenerator } from "./useCustomerJobs";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { transformToFormValues } from "../../helpers/job";

export const useUpdateJobAddress = (
  customerId: string | undefined,
  addressId: string | undefined
) => {
  const { mutate } = useSWRConfig();
  const filters: JobFilters = { start: "", end: "" };

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string, string, string] | null,
    string
  >(
    customerId && addressId ? ["job-address", customerId, addressId] : null,
    async ([_operation, customerId, addressId], { arg: newAddressId }) => {
      if (!customerId || !addressId) throw "Invalid IDs";

      const { items: customerFutureJobs } = await getCustomerJobs(customerId, {
        start: new Date().toISOString(),
      });

      const addressFutureJobs = customerFutureJobs.filter(
        (job) => job.addressId === addressId
      );

      for (const existingJob of addressFutureJobs) {
        const assignedToId =
          typeof existingJob.assignedTo === "object"
            ? existingJob.assignedTo.sub
            : existingJob.assignedTo || "";
        const formCompatibleJob: JobFormValues = {
          ...transformToFormValues(existingJob),
          assignedTo: assignedToId,
          addressId: newAddressId,
        };

        await editCustomerJob(customerId, existingJob.id, formCompatibleJob);
      }

      await mutate(
        unstable_serialize(keyFunctionGenerator(customerId, filters)),
        undefined,
        { revalidate: true, populateCache: false }
      );
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    updateJobAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
