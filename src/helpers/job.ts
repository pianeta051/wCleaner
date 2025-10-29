import { JobFormValues } from "../components/JobForm/JobForm";
import { Job } from "../types/types";
import dayjs from "dayjs";

export const transformToFormValues = (job: Job): JobFormValues => {
  return {
    date: dayjs(job.date),
    startTime: dayjs(`${job.date} ${job.startTime}`),
    endTime: dayjs(`${job.date} ${job.endTime}`),
    price: job.price,
    jobTypeId: job.jobTypeId ?? "",
    assignedTo: job.assignedTo?.sub ?? "",
    addressId: job.addressId ?? "",
    status: job.status ?? "pending",
    paymentMethod: job.paymentMethod ?? "none",
  };
};
