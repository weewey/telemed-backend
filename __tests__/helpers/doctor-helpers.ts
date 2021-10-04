import Doctor from "../../src/models/doctor";

export const destroyDoctorsByIds = async (ids: number[]): Promise<void> => {
  await Doctor.destroy({ where: { ids } });
};
