import { Factory } from "rosie";
import Clinic from "../../src/models/clinic";

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
  .attr("name", () => "clinic name")
  .attr("email", () => "email@email.com")
  .attr("postalCode", () => "123456")
  .attr("phoneNumber", () => "12341234")
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()));

export const clinicFactory = buildWrapper<Clinic>(clinic);
