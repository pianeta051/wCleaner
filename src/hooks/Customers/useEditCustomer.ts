import useSWRMutation from "swr/mutation";
import { editCustomer } from "../../services/customers";
import { Customer } from "../../types/types";
import { CustomerFormValues } from "../../components/Customer/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";

export const useEditCustomer = (
  id: string | undefined,
  slug: string | undefined
) => {
  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    Error,
    readonly [string, string] | null,
    CustomerFormValues
  >(
    slug && id ? ["customer", slug] : null,
    async ([_operation, _slug], { arg: formValues }) =>
      editCustomer(id as string, formValues),
    {
      revalidate: false,
      populateCache: true,
    }
  );

  return {
    editCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
