"use strict";

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Doctors", {
          type: "unique",
          fields: ['authId'],
          name: "Doctors_authId_unique_key"
        }, { transaction: t }),
        queryInterface.addConstraint("Doctors", {
          type: "unique",
          fields: ['email'],
          name: "Doctors_email_unique_key"
        }, { transaction: t }),
        queryInterface.addConstraint("Doctors", {
          type: "unique",
          fields: ['mobileNumber'],
          name: "Doctors_mobileNumber_unique_key"
        }, { transaction: t })
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Doctors", "Doctors_authId_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Doctors", "Doctors_email_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Doctors", "Doctors_mobileNumber_unique_key", { transaction: t }),
      ])
    })
  }
};