import { deleteCustomer } from "../services/customers";
import { Customer } from "../types/types";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../services/error";
import { useSWRConfig } from "swr";

export const useDeleteCustomer = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id]) => {
      await deleteCustomer(id);
      await mutate<
        readonly [
          string,
          string | undefined,
          string | undefined,
          string[] | undefined
        ],
        {
          customers: Customer[];
          nextToken?: string;
        }
      >(
        (key) => Array.isArray(key) && key.length > 0 && key[0] === "customers",
        undefined,
        { populateCache: true, revalidate: false }
      );
    },
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
