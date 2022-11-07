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

export const addCustomer = (customer: Customer) =>
  customers.push({ ...customer, id: customers.length + 1 });

export const editCustomer = (editedCustomer: Customer) => {
  customers.findIndex((customer) => {
    if (customer.url === editedCustomer.url) {
      customer = editedCustomer;
    }
  });
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
