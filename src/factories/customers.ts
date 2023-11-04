import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Customer } from "../types/types";

export const customerFactory = Factory.define<Customer>(() => ({
  name: faker.person.fullName(),
  address: faker.location.streetAddress(false),
  postcode: faker.location.zipCode(),
  mainTelephone: faker.phone.number(),
  secondTelephone: faker.phone.number(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  slug: faker.phone.imei(),
}));
