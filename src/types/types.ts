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
export type JobAssignation = {
  sub: string;
  name?: string;
  email: string;
  color?: string;
};

export type Job = {
  customerId?: string;
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  customer?: Customer;
  assignedTo?: JobAssignation;
  jobTypeId?: string;
};

export type JobFilters = {
  start?: string;
  end?: string;
};

export type JobsPaginationArguments = {
  nextToken?: string;
  paginate?: boolean;
};

export type JobType = {
  id: string;
  name: string;
  color: string;
};
