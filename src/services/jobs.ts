import { API } from "aws-amplify";

import { Job } from "../types/types";
import { isErrorResponse } from "./error";
import { JobFormValues } from "../components/Jobs/JobForm/JobForm";
const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number } = {}
) => {
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (
  path: string,
  body: { [param: string]: string | number } = {}
) => {
  return API.post("wCleanerApi", path, {
    body,
  });
};

const remove = async (path: string) => {
  return API.del("wCleanerApi", path, {});
};

const put = async (
  path: string,
  body: { [param: string]: string | number } = {}
) => {
  return API.put("wCleanerApi", path, {
    body,
  });
};

const isJob = (value: unknown): value is Job => {
  return (
    typeof value === "object" &&
    value !== null &&
    "date" in value &&
    typeof (value as Job)["date"] === "string" &&
    "time" in value &&
    typeof (value as Job)["time"] === "string" &&
    "price" in value &&
    typeof (value as Job)["price"] === "number" &&
    "id" in value &&
    typeof (value as Job)["id"] === "string" &&
    "customerId" in value &&
    typeof (value as Job)["customerId"] === "string"
  );
};

export const addJob = async (
  customerId: string,
  formValues: JobFormValues
): Promise<Job> => {
  try {
    const response = await post(`/customers/${customerId}/job`, {
      ...formValues,
      date: formValues.date.toISOString(),
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
  //   console.log(response);
  //   if (!isJob(response.job)) {
  //     throw "INTERNAL_ERROR";
  //   }
  //   return response.job;
  // } catch (error) {
  //   throw "INTERNAL_ERROR";
  // }
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
      date: formValues.date.toISOString(),
    });
    if (!isJob(response.job)) {
      throw "INTERNAL_ERROR";
    }
    return response.job;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 404) {
        throw "JOB_NOT_EXISTS";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

export const getCustomerJobs = async (
  customerId: string,
  nextToken?: string
): Promise<{ items: Job[]; nextToken?: string }> => {
  try {
    const response = await get(`/customers/${customerId}/jobs`, {
      nextToken,
    });
    if (
      !response.jobs ||
      !Array.isArray(response.jobs)
      // ||     response.jobs.some((element: unknown) => !isJob(element))
      //   ||
      //   (response.nextToken !== undefined &&
      //     typeof response.nextToken !== "string")
    ) {
      throw "INTERNAL_ERROR";
    }
    return {
      items: response.jobs,
      nextToken: response.nextToken,
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
