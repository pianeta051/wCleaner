import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Job } from "../../types/types";
import { extractErrorCode } from "../../services/error";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomerJobs";
import { generateJobInvoice } from "../../services/jobs";
import { InvoiceFormValues } from "../../components/InvoiceForm/InvoiceForm";

type Key = readonly [string, string, string] | null;
export const useGenerateInvoice = (customerId?: string, jobId?: string) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error, data } = useSWRMutation<
    Job,
    string,
    Key,
    InvoiceFormValues
  >(
    customerId && jobId ? ["generate-invoice", customerId, jobId] : null,
    async ([_k, customerId, jobId], { arg }) => {
      const job = await generateJobInvoice(customerId, jobId, arg);

      const filters = { start: "", end: "" };

      await mutate(
        unstable_serialize(keyFunctionGenerator(customerId, filters)),
        undefined,
        { revalidate: true, populateCache: false }
      );
      return job;
    },
    { revalidate: false, populateCache: false }
  );

  return {
    generate: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
    job: data,
  };
};
