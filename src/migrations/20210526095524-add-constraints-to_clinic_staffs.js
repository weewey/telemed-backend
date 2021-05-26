module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("ClinicStaffs", {
          type: "unique",
          fields: [ "authId" ],
          name: "ClinicStaffs_authId_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("ClinicStaffs", {
          type: "unique",
          fields: [ "email" ],
          name: "ClinicStaffs_email_unique_key",
        }, { transaction: t }),
        queryInterface.addConstraint("ClinicStaffs", {
          type: "unique",
          fields: [ "mobileNumber" ],
          name: "ClinicStaffs_mobileNumber_unique_key",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("ClinicStaffs", "ClinicStaffs_authId_unique_key", { transaction: t }),
        queryInterface.removeConstraint("ClinicStaffs", "ClinicStaffs_email_unique_key", { transaction: t }),
        queryInterface.removeConstraint("ClinicStaffs", "ClinicStaffs_mobileNumber_unique_key", { transaction: t }),
      ]);
    });
  },
};
