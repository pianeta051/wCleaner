import { API } from "aws-amplify";

import {
  Job,
  JobAssignation,
  JobFilters,
  JobsPaginationArguments,
  JobType,
} from "../types/types";
import { isErrorResponse } from "./error";
import { JobFormValues } from "../components/JobForm/JobForm";
import { isCustomer } from "./customers";
import { JobTypeFormValues } from "../components/JobTypeForm/JobTypeForm";
const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number } = {}
) => {
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (path: string, body: { [param: string]: unknown } = {}) => {
  return API.post("wCleanerApi", path, {
    body,
  });
};

const remove = async (path: string) => {
  return API.del("wCleanerApi", path, {});
};

const put = async (path: string, body: { [param: string]: unknown } = {}) => {
  return API.put("wCleanerApi", path, {
    body,
  });
};

const isJobAssignation = (value: unknown): value is JobAssignation => {
  if (!value) {
    // If value is null, then it's not a JobAssignation
    return false;
  }
  if (typeof value !== "object") {
    // If value is not an object, then it's not a JobAssignation
    return false;
  }
  // Trick so we get correct suggestions from VSCode
  const objectValue = value as JobAssignation;
  if (!objectValue.sub) {
    // sub is mandatory
    return false;
  }
  if (typeof objectValue.sub !== "string") {
    // sub must be of type string
    return false;
  }
  if (objectValue.name !== undefined) {
    // if it's not undefined, it must be a string
    if (typeof objectValue.name !== "string") {
      return false;
    }
  }
  if (!objectValue.email) {
    // email is mandatory
    return false;
  }
  if (typeof objectValue.email !== "string") {
    // email must be of type string
    return false;
  }
  return true;
};

const isJobType = (value: unknown): value is JobType => {
  if (!value) {
    return false;
  }
  if (typeof value !== "object") {
    // If value is not an object, then it's not a Job
    return false;
  }

  const jobTypeValue = value as JobType;

  if (!jobTypeValue.color) {
    return false;
  }
  if (typeof jobTypeValue.color !== "string") {
    return false;
  }
  if (typeof jobTypeValue.name !== "string") {
    return false;
  }
  if (typeof jobTypeValue.id !== "string") {
    return false;
  }
  return true;
};
const isJob = (value: unknown): value is Job => {
  if (!value) {
    // If value is null, then it's not a Job
    return false;
  }
  if (typeof value !== "object") {
    // If value is not an object, then it's not a Job
    return false;
  }
  // Trick so we get correct suggestions from VSCode
  const objectValue = value as Job;

  if (objectValue.customerId !== undefined) {
    // customerId must be of type string when it's not undefined
    if (typeof objectValue.customerId !== "string") {
      return false;
    }
  }

  if (!objectValue.id) {
    // id is mandatory
    return false;
  }
  if (typeof objectValue.id !== "string") {
    // id must be of type string
    return false;
  }

  if (!objectValue.startTime) {
    // startTime is mandatory
    return false;
  }
  if (typeof objectValue.startTime !== "string") {
    // startTime must be of type string
    return false;
  }

  if (!objectValue.date) {
    // date is mandatory
    return false;
  }
  if (typeof objectValue.date !== "string") {
    // date must be of type string
    return false;
  }

  if (!objectValue.endTime) {
    // endTime is mandatory
    return false;
  }
  if (typeof objectValue.endTime !== "string") {
    // endTime must be of type string
    return false;
  }

  if (!objectValue.price) {
    // price is mandatory
    return false;
  }
  if (typeof objectValue.price !== "number") {
    // price must be of type string
    return false;
  }

  if (objectValue.customer !== undefined) {
    // if it's not undefined, it must be a valid customer
    if (!isCustomer(objectValue.customer)) {
      return false;
    }
  }

  if (objectValue.assignedTo !== undefined) {
    // if it's not undefined, it must be a valid JobAssignation
    if (!isJobAssignation(objectValue.assignedTo)) {
      return false;
    }
  }

  return true;
};

export const addJob = async (
  customerId: string,
  formValues: JobFormValues
): Promise<Job> => {
  try {
    const response = await post(`/customers/${customerId}/job`, {
      ...formValues,
      date: formValues.date.format("YYYY-MM-DD"),
      startTime: formValues.startTime.format("HH:mm"),
      endTime: formValues.endTime.format("HH:mm"),
    });
    if (!isJob(response.job)) {
      throw "INTERNAL_ERROR";
    }
    return response.job;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

export const addJobType = async (
  formValues: JobTypeFormValues
): Promise<JobType> => {
  try {
    const response = await post(`/job-type`, formValues);
    if (!isJobType(response.jobType)) {
      throw "INTERNAL_ERROR";
    }
    return response.job;
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};

export const deleteCustomerJob = async (
  customerId: string,
  jobId: string
): Promise<void> => {
  try {
    await remove(`/customers/${customerId}/job/${jobId}`);
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};

export const editCustomerJob = async (
  customerId: string,
  jobId: string,
  formValues: JobFormValues
): Promise<Job> => {
  try {
    const response = await put(`/customers/${customerId}/job/${jobId}`, {
      ...formValues,
      price: +formValues.price,
      date: formValues.date.format("YYYY-MM-DD"),
      startTime: formValues.startTime.format("HH:mm"),
      endTime: formValues.endTime.format("HH:mm"),
      assigned_to: formValues.assignedTo,
    });
    if (!isJob(response.job)) {
      throw "INTERNAL_ERROR";
    }
    return response.job;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

export const getCustomerJobs = async (
  customerId: string,
  filters?: JobFilters,

  order: "asc" | "desc" = "asc"
): Promise<{ items: Job[] }> => {
  try {
    const response = await get(`/customers/${customerId}/jobs`, {
      ...filters,
      order,
    });

    if (
      !response.jobs ||
      !Array.isArray(response.jobs) ||
      response.jobs.some((element: unknown) => !isJob(element)) ||
      response.nextToken !== undefined
    ) {
      throw "INTERNAL_ERROR";
    }
    return {
      items: response.jobs,
    };
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw "CUSTOMER_NOT_FOUND";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

export const getJob = async (id: string): Promise<Job> => {
  try {
    const response = await get(`/jobs/${id}`);
    if (!("job" in response) && typeof response.job !== "object") {
      throw "INTERNAL_ERROR";
    }
    if (!isJob(response.job)) {
      throw "INTERNAL_ERROR";
    }
    return response.job;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 404) {
        throw "NOT_FOUND";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const getJobs = async (
  filters: JobFilters,
  order: "asc" | "desc" = "asc",
  { nextToken, paginate }: JobsPaginationArguments = { paginate: true }
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  try {
    const response = await get("/jobs", {
      ...filters,
      order,
      nextToken,
      paginate: paginate === false ? "false" : "true",
    });
    if (!Array.isArray(response.jobs) || !response.jobs.every(isJob)) {
      throw "INTERNAL_ERROR";
    }
    return { jobs: response.jobs, nextToken: response.nextToken };
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};
