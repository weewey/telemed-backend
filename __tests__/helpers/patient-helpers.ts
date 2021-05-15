import Patient from "../../src/models/patient";
import { PatientAttributes } from "../../src/respository/patient-repository";

export const destroyPatientByField = async (field: Partial<PatientAttributes>): Promise<void> => {
  await Patient.destroy({ where: { ...field } });
};
