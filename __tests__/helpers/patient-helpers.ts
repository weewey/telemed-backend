import Patient from "../../src/models/patient";

export const destroyPatientsByIds = async (id: number[]): Promise<void> => {
  await Patient.destroy({ where: { id } });
};
