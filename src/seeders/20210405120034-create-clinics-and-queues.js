module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert("Clinics", [ {
        name: "Clinic name 1",
        imageUrl: "http://image",
        address: "Clinic Address 1",
        lat: 1.30328,
        long: 103.847049,
        postalCode: "012345",
        email: "email@email.com",
        phoneNumber: "12345678",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Clinic name 2",
        imageUrl: "http:image.url",
        address: "Clinic Address 2",
        lat: 1.30328,
        long: -103.847049,
        postalCode: "222222",
        email: "email2@email.com",
        phoneNumber: "12345679",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ], { transaction: t });
      const clinic = await queryInterface.sequelize.query("SELECT id FROM \"Clinics\" limit 1;", { transaction: t });
      await queryInterface.bulkInsert("Queues", [ {
        clinicId: clinic[0][0].id,
        status: "INACTIVE",
        pendingTicketIdsOrder: "{}",
        latestGeneratedTicketDisplayNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        clinicId: clinic[0][0].id,
        status: "INACTIVE",
        pendingTicketIdsOrder: "{}",
        latestGeneratedTicketDisplayNumber: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ], { transaction: t });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Queues", null, {});
    await queryInterface.bulkDelete("Clinics", null, {});
  },
};
