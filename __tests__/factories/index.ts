import { randomInt } from "crypto";
import { Factory } from "rosie";
import { v4 as generateUUID } from "uuid";
import Clinic from "../../src/models/clinic";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";

interface BuildWrapperResult<T> {
  build: (props?: any) => Promise<T>;
  instantiate: (props?: any) => T;
}

const buildWrapper = <T>(factory: any): BuildWrapperResult<T> => {
  const build = async (options = {}): Promise<T> => {
    const instance = factory.build(options);
    await instance.save();
    return instance;
  };
  const instantiate = (options = {}): T => {
    return factory.build(options);
  };
  return { build, instantiate };
};

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

const queue = Factory.define<Queue>("queue", Queue)
  .attr("clinicId", () => randomInt(1, 1000))
  .attr("status", () => QueueStatus.INACTIVE)
  .attr("latestGeneratedTicketDisplayNumber", () => 0)
  .attr("waitingTicketsId", () => [])
  .attr("closedTicketsId", () => [])
  .attr("startedAt", () => new Date(Date.now()))
  .attr("closedAt", () => new Date(Date.now()))
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()));

export const queueFactory = buildWrapper<Queue>(queue);
