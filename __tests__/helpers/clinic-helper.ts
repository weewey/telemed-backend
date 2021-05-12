import Clinic from "../../src/models/clinic";

export const createClinic = (
  name = "clinic-component-test-name",
  address = "clinic-component-test-address",
  postalCode = "clinic-component-test-postal-code",
  email = "clinic-component-test-email",
  phoneNumber = "clinic-component-test-phone-number",
): Promise<Clinic> => {
  return Clinic.create({ name, address, postalCode, email, phoneNumber } as Clinic);
};

export const destroyClinicById = async (id: number): Promise<void> => {
  await Clinic.destroy({ where: { id } });
};
