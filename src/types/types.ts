import { Dayjs } from "dayjs";
export type Customer = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone: string;
  secondTelephone: string;
  email: string;
  id: string;
  slug: string;
};

export type Job = {
  customerId: string;
  id: string;
  date: string;
  time: string;
  price: number;
};
