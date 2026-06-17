import { get, put } from "./dataApi";
import { InvoiceSettings } from "../types/types";

export const getInvoiceSettings = async (): Promise<InvoiceSettings> => {
  const response = (await get("/settings/invoice")) as {
    settings: InvoiceSettings;
  };

  return response.settings;
};

export const updateInvoiceSettings = async (
  settings: InvoiceSettings
): Promise<InvoiceSettings> => {
  const response = (await put("/settings/invoice", settings)) as {
    settings: InvoiceSettings;
  };

  return response.settings;
};
