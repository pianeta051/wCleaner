import useSWRMutation from "swr/mutation";
import { updateJobInvoicePaid } from "../../services/invoices";

type UpdateInvoicePaidArgs = {
  customerId: string;
  jobId: string;
  paid: boolean;
};

export const useUpdateInvoicePaid = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    "update-invoice-paid",
    async (_key, { arg }: { arg: UpdateInvoicePaidArgs }) => {
      return updateJobInvoicePaid(arg.customerId, arg.jobId, arg.paid);
    }
  );

  return {
    updateInvoicePaid: trigger,
    loading: isMutating,
    error,
  };
};
