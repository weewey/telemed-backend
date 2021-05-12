module.exports = {
  up: async (queryInterface) => {
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

    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Clinics", null, {});
  },
};
