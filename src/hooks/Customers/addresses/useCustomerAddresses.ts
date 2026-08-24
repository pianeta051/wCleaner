import useSWR from "swr";
import { CustomerCleaningAddress } from "../../../types/types";
import { extractErrorCode } from "../../../services/error";
import { getCustomerAddressses } from "../../../services/customers";

export const useCustomerAddresses = (customerId: string | undefined) => {
  const { data, isLoading, error } = useSWR<
    CustomerCleaningAddress[],
    Error,
    readonly [string, string] | null
  >(
    customerId ? ["customer-addresses", customerId] : null,
    async ([_operation, customerId]) => getCustomerAddressses(customerId)
  );

  return {
    addresses: data,
    error: extractErrorCode(error),
    loading: isLoading,
  };
};
