import { useState } from "react";
import useSWR from "swr";
import { searchCustomers } from "../../services/customers";
import useDebounce from "../utils/useDebounce";
import { extractErrorCode } from "../../services/error";

const SEARCH_DELAY_MS = 300;

export const useCustomerSearch = (searchInput: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const search = searchInput.trim();

  useDebounce(() => setDebouncedSearch(search), SEARCH_DELAY_MS, [search]);

  const { data, error, isLoading } = useSWR(
    ["customer-search", debouncedSearch] as const,
    ([, searchInput]) => searchCustomers(searchInput),
    { revalidateOnFocus: false }
  );

  const isDebouncing = search !== debouncedSearch;

  return {
    customers: isDebouncing ? [] : data ?? [],
    loading: isDebouncing || isLoading,
    error:
      !isDebouncing && error
        ? extractErrorCode(error) ?? "INTERNAL_ERROR"
        : null,
  };
};
