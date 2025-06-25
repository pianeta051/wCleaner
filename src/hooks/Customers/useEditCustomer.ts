import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { editCustomer } from "../../services/customers";
import { Customer } from "../../types/types";
import { CustomerFormValues } from "../../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";

export const useEditCustomer = (
  id: string | undefined,
  slug: string | undefined
) => {
  const key = slug && id ? (["customer", slug] as const) : null;

  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    string,
    readonly [string, string] | null,
    CustomerFormValues
  >(
    key,
    async ([_operation, _slug], { arg: formValues }) =>
      editCustomer(id as string, formValues),
    {
      revalidate: false,
      populateCache: true,
    }
  );

  const reload = async () => {
    if (key) {
      await mutate(key);
    }
  };

  return {
    editCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
    reload,
  };
};
