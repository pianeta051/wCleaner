import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { Customer } from "../types/types";

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
  await sleep(2000);
  const customer: Customer = {
    ...formValues,
    id: customers.length + 1,
    url: generateUrl(formValues.email),
  };
  if (
    customers.find((existingCustomer) => existingCustomer.url === customer.url)
  ) {
    throw "The URL cannot be duplicated";
  }
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

export const getCustomers = () => customers;

export const getCustomer = (url?: string) => {
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
