import { CustomerFormValues } from "../components/Customer/CustomerForm/CustomerForm";
import { Customer } from "../types/types";

export const customerToFormValues = (
  customer: Customer
): CustomerFormValues => ({
  name: customer.name,
  address: customer.address,
  postcode: customer.postcode,
  mainTelephone: customer.mainTelephone ?? "",
  secondTelephone: customer.secondTelephone ?? "",
  email: customer.email ?? "",
  fileUrls: customer.fileUrls ?? [],
});
