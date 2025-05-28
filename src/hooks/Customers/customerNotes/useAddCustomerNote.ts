import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

import { addCustomerNote } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { NoteFormValues } from "../../../components/NoteForm/NoteForm";

export const useAddCustomerNote = (customerId?: string) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    [string, string] | null,
    NoteFormValues,
    void
  >(
    customerId ? ["add-CustomerNote", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) => {
      await addCustomerNote(customerId, formValues);

      await mutate(["customer-notes", customerId]);
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
