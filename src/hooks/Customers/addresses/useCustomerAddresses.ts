import useSWR from "swr";
import { CustomerCleaningAddress } from "../../../types/types";
import { extractErrorCode } from "../../../services/error";
import { getCustomerAddressses } from "../../../services/customers";

export const useCustomerAddresses = (customerId: string) => {
  const { data, isLoading, error } = useSWR<
    CustomerCleaningAddress[],
    Error,
    readonly [string, string] | null
  >(["customer-addresses", customerId], async ([_operation, customerId]) =>
    getCustomerAddressses(customerId)
  );

  return {
    addresses: data,
    error: extractErrorCode(error),
    loading: isLoading,
  };
};
