import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

import { editCustomerNote } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { NoteFormValues } from "../../../components/NoteForm/NoteForm";

export const useEditCustomerNote = (
  customerId?: string,
  customerSlug?: string,
  noteId?: string
) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    [string, string, string] | null,
    NoteFormValues,
    void
  >(
    customerId && noteId && customerSlug
      ? ["edit-CustomerNote", customerId, noteId]
      : null,
    async ([_operation, customerId, noteId], { arg: formValues }) => {
      await editCustomerNote(customerId, noteId, formValues);

      await mutate(["customer", customerSlug]);
      await mutate(["customer", customerId]);
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    editCustomerNote: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
