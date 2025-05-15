import { deleteCustomer } from "../../services/customers";
import { Customer } from "../../types/types";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { keyFunctionGenerator } from "./useCustomers";
import { unstable_serialize } from "swr/infinite";

export const useDeleteCustomer = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id]) => {
      await deleteCustomer(id);
      // Mutar la cache de coleccion de customers
      await mutate<
        readonly [string, string | undefined, string | undefined],
        {
          customers: Customer[];
          nextToken?: string;
        } | null
      >(
        unstable_serialize(keyFunctionGenerator("")), // claves de cache a modificar
        () => undefined, // valor que le queremos dar
        // opciones
        { revalidate: true, populateCache: false }
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
