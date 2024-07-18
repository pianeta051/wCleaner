import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Job } from "../types/types";
import dayjs from "dayjs";
export const jobFactory = Factory.define<Job>(() => ({
  customerId: faker.string.uuid(),
  id: faker.string.uuid(),
  date: dayjs(faker.date.future()).toISOString(),
  startTime: "12:00",
  endTime: "13:00",
  price: faker.number.int(),
}));
