import { Factory } from "rosie";
import Clinic from "../../src/models/clinic";
import { v4 as generateUUID } from "uuid";
import { randomInt } from "crypto";
import { buildWrapper } from "./index";

const clinic = Factory.define<Clinic>("clinic", Clinic)
  .attr("address", () => "address")
  .attr("name", () => `clinic name ${generateUUID()}`)
  .attr("email", () => `email${generateUUID()}@email.com`)
  .attr("postalCode", () => randomInt(111111, 999999).toString())
  .attr("phoneNumber", () => randomInt(88888888, 99999999).toString())
  .attr("createdAt", () => new Date(Date.now()))
  .attr("lat", () => 1.1)
  .attr("long", () => 100.1)
  .attr("updatedAt", () => new Date(Date.now()));

export const clinicFactory = buildWrapper<Clinic>(clinic);
