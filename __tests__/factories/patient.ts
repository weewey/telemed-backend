import { Factory } from "rosie";
import { buildWrapper } from "./index";
import Patient from "../../src/models/patient";
import { v4 as generateUUID } from "uuid";
import { generateRandomString } from "../helpers/common-helpers";

const patient = Factory.define<Patient>("patient", Patient)
  .attr("firstName", () => generateRandomString(8))
  .attr("lastName", () => generateRandomString(8))
  .attr("email", () => `${generateRandomString(8)}@gmail.com`)
  .attr("authId", () => generateUUID())
  .attr("mobileNumber", () => generateRandomString(8))
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()));

export const patientFactory = buildWrapper<Patient>(patient);
