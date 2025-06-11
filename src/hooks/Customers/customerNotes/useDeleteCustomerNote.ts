import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { extractErrorCode } from "../../../services/error";
import { deleteCustomerNote } from "../../../services/customers";
import { CustomerNote } from "../../../types/types";

export const useDeleteCustomerNote = (
  customerId?: string,
  customerSlug?: string
) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string, string] | null,
    string, // noteId passed as the argument
    CustomerNote | null
  >(
    customerId && customerSlug ? ["customer", customerId] : null,
    async ([_operation, customerId], { arg: noteId }) => {
      await deleteCustomerNote(customerId, noteId);

      await mutate(["customer", customerSlug], undefined, {
        revalidate: true,
        populateCache: false,
      });
      await mutate(["customer", customerId], undefined, {
        revalidate: true,
        populateCache: false,
      });
    },
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteNote: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
