module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Staffs", {
          type: "unique",
          fields: [ "authId" ],
          name: "Staffs_authId_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("Staffs", {
          type: "unique",
          fields: [ "email" ],
          name: "Staffs_email_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("Staffs", {
          type: "unique",
          fields: [ "mobileNumber" ],
          name: "Staffs_mobileNumber_unique_key",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Staffs", "Staffs_authId_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Staffs", "Staffs_email_unique_key", { transaction: t }),
        queryInterface.removeConstraint("Staffs", "Staffs_mobileNumber_unique_key", { transaction: t }),
      ]);
    });
  },
};
