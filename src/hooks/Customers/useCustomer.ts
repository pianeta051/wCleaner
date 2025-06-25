import useSWR from "swr";
import { Customer } from "../../types/types";
import { getCustomer } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useCustomer = (slug: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR<
    Customer | null,
    Error,
    readonly [string, string] | null
  >(slug ? ["customer", slug] : null, async ([_operation, slug]) =>
    getCustomer(slug)
  );

  return {
    customer: data,
    error: extractErrorCode(error),
    loading: isLoading,
    reload: mutate,
  };
};
