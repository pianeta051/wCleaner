export type Customer = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone?: string;
  secondTelephone?: string;
  email?: string;
  id: string;
  slug: string;
  fileUrls?: string[];
  notes?: CustomerNote[];
  cleaningAddresses?: CustomerCleaningAddress[];
};

export type CustomerCleaningAddress = {
  id: string;
  name: string;
  address: string;
  postcode: string;
};

export type CustomerNote = {
  id: string;
  title: string;
  content: string;
  author?: string;
  timestamp?: number;
  isFavourite: boolean;
  updatedAt?: number; // last edit
  updatedBy?: string; // who edited
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
  jobTypeName?: string;
  addressId?: string;
  address?: string;
  postcode?: string;
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
