import useSWRMutation from "swr/mutation";
import { Customer } from "../../types/types";
import { addCustomer } from "../../services/customers";
import { CustomerFormValues } from "../../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomers";

export const useAddCustomer = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    Error,
    [string],
    CustomerFormValues,
    Customer | null
  >(
    ["add-customer"],
    async (_operation, { arg: formValues }) => {
      const customer = await addCustomer(formValues);
      // Mutar la cache de customer individual
      await mutate<readonly [string, string], Customer>(
        // Una vez que sabes el id, ya haces la mutacion de cache
        ["customer", customer.slug],
        customer,
        // opciones para el mutate de un customer
        { populateCache: true, revalidate: false }
      );
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
