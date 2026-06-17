import useSWRMutation from "swr/mutation";
import { InvoiceSettings } from "../../types/types";
import { ErrorResponseShape } from "./useGenerateInvoice";
import { extractErrorCode } from "../../services/error";
import { updateInvoiceSettings } from "../../services/setting";

export const useUpdateInvoiceSettings = () => {
  const key = ["update-invoice-settings"];
  const { trigger, isMutating, error } = useSWRMutation<
    InvoiceSettings,
    ErrorResponseShape,
    typeof key,
    InvoiceSettings
  >(key, async (_key, { arg }: { arg: InvoiceSettings }) => {
    return updateInvoiceSettings(arg);
  });

  const formattedError =
    error?.response?.data?.error ??
    (error?.response?.status === 404 ? "INVOICE_NOT_FOUND" : undefined);
  return {
    updateInvoiceSettings: trigger,
    loading: isMutating,
    error: extractErrorCode(formattedError),
  };
};
