'use strict';

module.exports = {
  up: async (queryInterface) => {
      await queryInterface.bulkInsert('Clinics', [{
          address: "Clinic Address 1",
          postalCode: "012345",
          email: "email@email.com",
          phoneNumber: "12345678",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      {
        address: "Clinic Address 2",
        postalCode: "222222",
        email: "email2@email.com",
        phoneNumber: "12345679",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Clinics', null, {});
  }
};
