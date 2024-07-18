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
  startTime: string;
  endTime: string;
  price: number;
};
