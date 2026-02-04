import useSWR from "swr";
import { getCustomers } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { Customer } from "../../types/types";

type CustomersResponse = {
  customers: Customer[];
  nextToken?: string;
};

type CustomersKey = readonly [
  "customers",
  string | undefined,
  string[] | undefined
];

export const useCustomers = (
  searchInput?: string,
  outcodeFilter?: string[]
) => {
  const key: CustomersKey = ["customers", searchInput, outcodeFilter];

  const {
    data,
    error,
    isLoading: loading,
    mutate: reload,
  } = useSWR<CustomersResponse, Error, CustomersKey>(
    key,
    async ([_op, search, outcodes]) => {
      return getCustomers(
        { searchInput: search, outcodeFilter: outcodes },
        { disabled: true }
      );
    },
    {
      keepPreviousData: true,
    }
  );

  return {
    customers: data?.customers ?? [],
    error: extractErrorCode(error),
    loading,
    reload,
  };
};
