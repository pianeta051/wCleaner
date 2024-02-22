import { FC, ReactNode, useState } from "react";

import { CustomersContext } from "../../context/CustomersContext";
import {
  getCustomers as getCustomersFromService,
  deleteCustomer as deleteCustomerFromService,
} from "../../services/customers";

import { Customer } from "../../types/types";

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

  const getCustomers = async (
    nextToken?: string,
    searchInput?: string
  ): Promise<{
    customers: Customer[];
    nextToken?: string;
  }> => {
    const args = JSON.stringify({ nextToken, searchInput });
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

  const deleteCustomer = async (id: string): Promise<void> => {
    setGetCustomersStore({});
    return deleteCustomerFromService(id);
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        deleteCustomer,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
