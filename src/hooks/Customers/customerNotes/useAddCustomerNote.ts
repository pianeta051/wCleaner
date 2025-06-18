import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { addCustomerNote } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { NoteFormValues } from "../../../components/NoteForm/NoteForm";

export const useAddCustomerNote = (
  customerId?: string,
  customerSlug?: string,
  jobId?: string
) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    [string, string] | null,
    NoteFormValues,
    void
  >(
    customerId && customerSlug ? ["customer", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) => {
      await addCustomerNote(customerId, formValues);

      await mutate(["customer", customerSlug]);
      await mutate(["customer", customerId]);
      if (jobId) {
        await mutate(["job", customerId, jobId]);
      }
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    addCustomerNote: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
