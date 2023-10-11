import { FC, ReactNode, useState } from "react";

import { CustomersContext } from "../../context/CustomersContext";
import {
  getCustomers as getCustomersFromService,
  getCustomer as getCustomerFromService,
  editCustomer as editCustomerFromService,
  addCustomer as createCustomerFromService,
  deleteCustomer as deleteCustomerFromService,
} from "../../services/customers";

import { Customer } from "../../types/types";
import { CustomerFormValues } from "../Customer/CustomerForm/CustomerForm";

type CustomersProviderProps = {
  children?: ReactNode;
};

const MINUTES_TO_EXPIRE = 1;

const expirationDate = (minutesFromNow: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesFromNow);
  return date;
};

const isExpired = (expiresAt: Date) => {
  return expiresAt < new Date();
};

export const CustomersProvider: FC<CustomersProviderProps> = ({ children }) => {
  const [getCustomersStore, setGetCustomersStore] = useState<
    Record<
      string,
      {
        response: {
          customers: Customer[];
          nextToken?: string;
        };
        expiresAt: Date;
      }
    >
  >({});

  const [getCustomerStore, setGetCustomerStore] = useState<
    Record<string, { response: Customer | null; expiresAt: Date }>
  >({});

  const getCustomers = async (
    nextToken?: string,
    searchInput?: string,
    customerType?: string
  ): Promise<{
    customers: Customer[];
    nextToken?: string;
  }> => {
    const args = JSON.stringify({ nextToken, searchInput, customerType });
    if (
      getCustomersStore[args] &&
      !isExpired(getCustomersStore[args].expiresAt)
    ) {
      return getCustomersStore[args].response;
    }
    const response = await getCustomersFromService(nextToken, searchInput);
    setGetCustomersStore((getCustomersStore) => ({
      ...getCustomersStore,
      [args]: {
        response,
        expiresAt: expirationDate(MINUTES_TO_EXPIRE),
      },
    }));
    return response;
  };

  const getCustomer = async (id: string): Promise<Customer | null> => {
    const args = JSON.stringify({ id });
    if (
      getCustomerStore[args] &&
      !isExpired(getCustomerStore[args].expiresAt)
    ) {
      return getCustomerStore[args].response;
    }
    const response = await getCustomerFromService(id);
    setGetCustomerStore((getCustomerStore) => ({
      ...getCustomerStore,
      [args]: { response, expiresAt: expirationDate(MINUTES_TO_EXPIRE) },
    }));
    return response;
  };

  const editCustomer = async (
    id: string,
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setGetCustomerStore({});
    setGetCustomersStore({});
    return editCustomerFromService(id, formValues);
  };

  const addCustomer = async (
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setGetCustomersStore({});
    return createCustomerFromService(formValues);
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    setGetCustomersStore({});
    return deleteCustomerFromService(id);
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        getCustomer,
        editCustomer,
        addCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
