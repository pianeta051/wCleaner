import { useSWRConfig } from "swr";
import { CustomerNote } from "../../../types/types";
import useSWRMutation from "swr/mutation";
import { editCustomerNote } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useEditNoteFavourite = (
  customerId?: string,
  customerSlug?: string,
  jobId?: string
) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    [string, string] | null,
    { note: CustomerNote; newValue: boolean },
    void
  >(
    customerId && customerSlug ? ["customer", customerId] : null,
    async ([_operation, customerId], { arg: { note, newValue } }) => {
      await editCustomerNote(customerId, note.id, {
        ...note,
        isFavourite: newValue,
      });

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
    editCustomerNoteFavourite: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
