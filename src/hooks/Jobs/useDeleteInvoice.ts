import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { extractErrorCode } from "../../services/error";
import { deleteJobInvoice } from "../../services/jobs";

export const useDeleteInvoice = (customerId?: string, jobId?: string) => {
  const { mutate } = useSWRConfig();

  const key =
    customerId && jobId
      ? (["invoice-delete", customerId, jobId] as const)
      : null;

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    unknown,
    typeof key,
    void
  >(
    key,
    async () => {
      if (!customerId || !jobId) throw "INTERNAL_ERROR";

      await deleteJobInvoice(customerId, jobId);

      await mutate(["invoice", customerId, jobId], undefined, {
        populateCache: false,
        revalidate: false,
      });

      await mutate(["job", customerId, jobId], undefined, {
        populateCache: false,
        revalidate: true,
      });
    },
    { revalidate: false }
  );

  // @ts-expect-error axios-ish shape
  const code = error?.response?.data?.error;

  return {
    deleteInvoice: trigger,
    loading: isMutating,
    error: extractErrorCode(code),
  };
};
