import useSWRMutation from "swr/mutation";
import { deleteCustomerAddress } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useDeleteCustomerAddress = (customerId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string, string] | null,
    string
  >(
    customerId ? ["customerAddress", customerId] : null,
    async ([_operation, customerId], { arg: addressId }) => {
      await deleteCustomerAddress(customerId, addressId);
    },
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteCustomerAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
