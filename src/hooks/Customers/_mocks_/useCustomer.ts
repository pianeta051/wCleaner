import { Customer } from "../../../types/types";

export const mockCustomers: Customer[] = [];

export const useCustomers = () => ({
  customers: mockCustomers,
});
