import useSWRMutation from "swr/mutation";
import { Customer } from "../types/types";
import { addCustomer } from "../services/customers";
import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../services/error";
import { useSWRConfig } from "swr";

export const useAddCustomer = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    Error,
    string,
    CustomerFormValues,
    Customer | null
  >(
    "customer",
    async (_operation, { arg: formValues }) => {
      const customer = await addCustomer(formValues);
      await mutate<readonly [string, string], Customer>(
        ["customer", customer.id],
        customer,
        { populateCache: true, revalidate: false }
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
