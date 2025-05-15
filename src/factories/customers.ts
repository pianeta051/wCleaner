import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Customer } from "../types/types";
const ukPostcodes = [
  "E1 6AN",
  "SW1A 1AA",
  "W1A 0AX",
  "M1 1AE",
  "B1 1AA",
  "G1 1XX",
  "L1 8JQ",
  "CF10 1EP",
];
export const customerFactory = Factory.define<Customer>(() => ({
  name: faker.person.fullName(),
  address: faker.location.streetAddress(false),
  postcode: faker.helpers.arrayElement(ukPostcodes),
  mainTelephone: faker.number.int().toString(),
  secondTelephone: faker.number.int().toString(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  slug: faker.phone.imei(),
  fileUrls: [],
}));
