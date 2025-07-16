import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";

import { Customer } from "../../types/types";
import { addCustomer } from "../../services/customers";
import { CustomerFormValues } from "../../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";
import { keyFunctionGenerator } from "./useCustomers";

export const useAddCustomer = (searchInput: string, outcodes: string[]) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    string,
    [string],
    CustomerFormValues
  >(
    ["add-customer"],
    async (_key, { arg: formValues }) => {
      const customer = await addCustomer(formValues);

      await mutate(["customer", customer.slug], customer, {
        populateCache: true,
        revalidate: false,
      });

      await mutate(
        unstable_serialize(keyFunctionGenerator(searchInput, outcodes)),
        (
          current:
            | {
                customers: Customer[];
                nextToken?: string;
              }[]
            | undefined
        ) => {
          if (!current) return undefined;

          // Optional: only update if current filter matches new customer
          const firstPage = current[0] ?? {
            customers: [],
            nextToken: undefined,
          };
          return [
            {
              ...firstPage,
              customers: [customer, ...firstPage.customers],
            },
            ...current.slice(1),
          ];
        },
        {
          populateCache: true,
          revalidate: false,
        }
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
