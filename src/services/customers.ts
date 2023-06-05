import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { Customer } from "../types/types";

const PATHS = ["/customers"] as const;

export const get = async (
  path: typeof PATHS[number],
  queryParams: { [param: string]: string } = {}
) => {
  return API.get("wCleanerApi", path, {
    headers: {
      "Content-Type": "application/json",
    },
    queryStringParameters: queryParams,
  });
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Carlos",
    address: "123 Fake St",
    postcode: "2005",
    mainTelephone: "+12345",
    secondTelephone: "+54321",
    email: "carlos@fake.com",
    url: "carlos",
  },
  {
    id: 2,
    name: "John Smith",
    address: "46 Fauna St",
    postcode: "LU65DF",
    mainTelephone: "+48455",
    secondTelephone: "+54545",
    email: "john@fake.com",
    url: "john",
  },
  {
    id: 3,
    name: "Amalia Rosso",
    address: "87 Tilling St",
    postcode: "MD35PF",
    mainTelephone: "+997555",
    secondTelephone: "+36544",
    email: "amalia@fake.com",
    url: "amalia",
  },
];

const sleep = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const generateUrl = (email: string): string => {
  return email.split("@")[0];
};

export const addCustomer = async (formValues: CustomerFormValues) => {
  await sleep(1000);
  const existingCustomer = customers.find(
    (customer) => customer.email === formValues.email
  );
  if (existingCustomer) {
    throw "CUSTOMER_ALREADY_EXISTS";
  }

  const customer: Customer = {
    id: customers.length + 1,
    name: formValues.name,
    address: formValues.address,
    postcode: formValues.postcode,
    mainTelephone: formValues.mainTelephone,
    secondTelephone: formValues.secondTelephone,
    email: formValues.email,
    url: formValues.email.split("@")[0],
  };
  customers.push(customer);
  return customer;
};

export const editCustomer = async (
  formValues: CustomerFormValues,
  id: number
) => {
  await sleep(2000);
  const customerIndex = customers.findIndex((customer) => customer.id === id);
  if (customerIndex === -1) {
    throw "The customer does not exist";
  }
  const newCustomer = {
    ...formValues,
    id: customers[customerIndex].id,
    url: generateUrl(formValues.email),
  };
  customers[customerIndex] = newCustomer;
  return newCustomer;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await get("/customers");
  return response.customers;
};

export const getCustomer = async (url: string) => {
  await sleep(1000);
  const customer = customers.find((customer) => {
    if (url && customer.url === url) {
      return true;
    }
    return false;
  });
  if (customer === undefined) {
    return null;
  }
  return customer;
};

const findByEmail = (email: string) =>
  customers.find((customer) => customer.email === email);

export const customerExists = async (email: string) => {
  await sleep(1000);
  const customer = findByEmail(email);
  if (customer) {
    throw "CUSTOMER_ALREADY_EXISTS";
  }
};

export const updateCustomerName = async (email: string, newName: string) => {
  await sleep(1000);
  const customerIndex = customers.findIndex(
    (customer) => email === customer.email
  );
  if (customerIndex === -1) {
    throw "USER_NOT_EXISTS";
  }
  const newCustomer = {
    ...customers[customerIndex],
    name: newName,
  };
  customers[customerIndex] = newCustomer;
  return newCustomer;
};
