import { getOutcodes } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import useSWR from "swr";

export const useOutcodes = () => {
  const {
    data: outcodes,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<string[], Error, [string]>(["outcodes"], async ([_operation]) =>
    getOutcodes()
  );
  return {
    outcodes,
    error: extractErrorCode(error),
    loading,
    reload: mutate,
  };
};
