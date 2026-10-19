import useSWR from "swr";
import { getDueCleaningAddresses } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useDueCleaningAddresses = (days = 7) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR(
    ["due-cleaning-addresses", days],
    () => getDueCleaningAddresses(days),
    {
      keepPreviousData: true,
    }
  );

  return {
    addresses: data ?? [],
    error: extractErrorCode(error),
    loading,
    isValidating,
    reload: mutate,
  };
};
