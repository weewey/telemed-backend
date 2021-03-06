import { Factory } from "rosie";
import { buildWrapper } from "./index";
import { v4 as generateUUID } from "uuid";
import { generateRandomString } from "../helpers/common-helpers";
import Doctor from "../../src/models/doctor";

const doctor = Factory.define<Doctor>("doctor", Doctor)
  .attr("firstName", () => generateRandomString(8))
  .attr("lastName", () => generateRandomString(8))
  .attr("email", () => `${generateRandomString(8)}@gmail.com`)
  .attr("authId", () => generateUUID())
  .attr("mobileNumber", () => generateRandomString(8))
  .attr("dateOfBirth", () => new Date(Date.now()))
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()))
  .attr("onDuty", () => true);

export const doctorFactory = buildWrapper<Doctor>(doctor);
