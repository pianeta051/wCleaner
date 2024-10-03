import useSWR from "swr";
import { Customer } from "../../types/types";
import { getCustomerById } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useCustomerById = (id: string | undefined | null) => {
  const { data, isLoading, error } = useSWR<
    Customer | null,
    Error,
    readonly [string, string] | null
  >(id ? ["customer", id] : null, async ([_operation, id]) =>
    getCustomerById(id)
  );

  return {
    customer: data,
    error: extractErrorCode(error),
    loading: isLoading,
  };
};
