"use strict";

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Patients", {
          type: "unique",
          fields: ['authId'],
          name: "Patients_authId_unique_key"
        }, { transaction: t }),
        queryInterface.addConstraint("Patients", {
          type: "unique",
          fields: ['email'],
          name: "Patients_email_unique_key"
        }, { transaction: t })
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Patients", "Patients_authId_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Patients", "Patients_email_unique_key", { transaction: t }),
      ])
    })
  }
};