import { randomInt } from "crypto";
import { v4 as generateUUID } from "uuid";
import { ClinicAttributes } from "../../src/models/clinic";

export const getClinicAttrs = (overrideAttrs?: Partial<ClinicAttributes>): ClinicAttributes => {
  return {
    name: "clinic name",
    imageUrl: "http://image.url",
    lat: 1.2,
    long: 100.1,
    address: `${generateUUID()} Address`,
    postalCode: randomInt(111111, 999999).toString(),
    email: `${generateUUID()}@gmail.com`,
    phoneNumber: randomInt(88888888, 99999999).toString(),
    ...overrideAttrs,
  };
};
