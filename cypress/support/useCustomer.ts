import { customerFactory } from "@/factories/customers";

export const useCustomers = () => {
  return {
    customers: [
      customerFactory.build(),
      customerFactory.build(),
      customerFactory.build(),
    ],
  };
};
