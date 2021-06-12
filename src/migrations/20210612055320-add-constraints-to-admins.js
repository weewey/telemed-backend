module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Admins", {
          type: "unique",
          fields: [ "authId" ],
          name: "Admins_authId_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("Admins", {
          type: "unique",
          fields: [ "email" ],
          name: "Admins_email_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("Admins", {
          type: "unique",
          fields: [ "mobileNumber" ],
          name: "Admins_mobileNumber_unique_key",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Admins", "Admins_authId_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Admins", "Admins_email_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Admins", "Admins_mobileNumber_unique_key", { transaction: t }),
      ]);
    });
  },
};
