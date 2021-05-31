import { v4 as generateUUID } from "uuid";
import { ClinicAttributes } from "../../src/models/clinic";

export const getClinicAttrs = (overrideAttrs?: Partial<ClinicAttributes>): ClinicAttributes => {
  return {
    name: "clinic name",
    imageUrl: "http://image.url",
    lat: 1.2,
    long: 100.1,
    address: `${generateUUID()} Address`,
    postalCode: `${generateUUID()} Postal Code`,
    email: `${generateUUID()}@gmail.com`,
    phoneNumber: generateUUID().toString(),
    ...overrideAttrs,
  };
};
