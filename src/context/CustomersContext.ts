import { createContext, useContext } from "react";
import { Customer } from "../types/types";
import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string,
    searchButton?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  addCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  addCustomer: () =>
    Promise.resolve({
      name: "default",
      address: "default",
      postcode: "default",
      mainTelephone: "default",
      secondTelephone: "default",
      email: "default",
      id: "default",
      slug: "default",
    }),
  deleteCustomer: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
