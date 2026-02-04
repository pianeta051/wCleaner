import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

import { Customer } from "../../types/types";
import { addCustomer } from "../../services/customers";
import { CustomerFormValues } from "../../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";

export const useAddCustomer = () => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    string,
    readonly ["add-customer"],
    CustomerFormValues
  >(
    ["add-customer"],
    async (_key, { arg: formValues }) => {
      const customer = await addCustomer(formValues);

      //  Cache del detalle del customer
      await mutate(["customer", customer.slug], customer, {
        populateCache: true,
        revalidate: false,
      });

      // Revalida TODAS las listas de customers (con o sin filtros)
      await mutate(
        (key) => Array.isArray(key) && key.length > 0 && key[0] === "customers",
        undefined,
        { revalidate: true }
      );

      return customer;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    addCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
