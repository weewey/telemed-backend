module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Clinics", {
          type: "unique",
          fields: [ "email" ],
          name: "Clinics_email_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("Clinics", {
          type: "unique",
          fields: [ "phoneNumber" ],
          name: "Clinics_phoneNumber_unique_key",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Clinics", "Clinics_email_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Clinics", "Clinics_phoneNumber_unique_key", { transaction: t }),
      ]);
    });
  },
};
