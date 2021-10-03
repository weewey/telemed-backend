module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Doctors", [ {
      firstName: "James",
      lastName: "Hardly",
      email: "dr_james_hardly@gmail.com",
      authId: "3c338b64-f301-49a8-8dad-89692813a326",
      mobileNumber: "90000003",
      createdAt: new Date(),
      updatedAt: new Date(),
      onDuty: false,
    },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Doctors", null, {});
  },
};
