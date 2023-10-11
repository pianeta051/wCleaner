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
  getCustomer: (id: string) => Promise<Customer | null>;
  editCustomer: (
    id: string,
    formValues: CustomerFormValues
  ) => Promise<Customer>;
  addCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  getCustomer: () => Promise.resolve(null),
  editCustomer: () =>
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