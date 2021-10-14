module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Patients", [ {
      firstName: "John",
      lastName: "Doe",
      email: "john_doe@gmail.com",
      authId: "7e29adfc-54dd-4f92-b09e-95ea51ecabd0",
      mobileNumber: "90000001",
      createdAt: new Date(),
      updatedAt: new Date(),
      dateOfBirth: new Date(),
    },
    {
      firstName: "Peter",
      lastName: "Doe",
      email: "peter_doe@gmail.com",
      authId: "6783f08b-f141-4756-bda1-8eb6e30c48cc",
      mobileNumber: "90000002",
      createdAt: new Date(),
      updatedAt: new Date(),
      dateOfBirth: new Date(),
    },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Patients", null, {});
  },
};
