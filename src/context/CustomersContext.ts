import { createContext, useContext } from "react";
import { Customer } from "../types/types";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string,
    searchButton?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  deleteCustomer: (id: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),

  deleteCustomer: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
