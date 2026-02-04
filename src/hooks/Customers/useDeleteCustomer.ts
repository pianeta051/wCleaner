import { deleteCustomer } from "../../services/customers";

import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";

export const useDeleteCustomer = (id: string | undefined) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly ["customer", string] | null
  >(
    id ? ["customer", id] : null,
    async ([_key, customerId]) => {
      await deleteCustomer(customerId);

      // Revalida TODAS las listas de customers (con o sin filtros)
      await mutate(
        (key) => Array.isArray(key) && key.length > 0 && key[0] === "customers",
        undefined,
        { revalidate: true }
      );
    },
    {
      revalidate: false,
    }
  );

  return {
    deleteCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
