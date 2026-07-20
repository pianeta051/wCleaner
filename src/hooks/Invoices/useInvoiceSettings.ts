import useSWR from "swr";
import { getInvoiceSettings } from "../../services/setting";

export const useInvoiceSettings = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "invoice-settings",
    getInvoiceSettings
  );

  return {
    settings: data,
    loading: isLoading,
    error,
    reload: mutate,
  };
};
