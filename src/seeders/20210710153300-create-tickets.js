module.exports = {
  up: async (queryInterface) => {
    const queues = await queryInterface.sequelize.query("SELECT id FROM \"Queues\" limit 1;");
    const clinics = await queryInterface.sequelize.query("SELECT id FROM \"Clinics\" limit 1;");
    const patients = await queryInterface.sequelize.query("SELECT id FROM \"Patients\" limit 1;");
    await queryInterface.bulkInsert("Tickets", [ {
      displayNumber: 1,
      patientId: patients[0][0].id,
      status: "WAITING",
      queueId: queues[0][0].id,
      clinicId: clinics[0][0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Tickets", null, {});
  },
};
