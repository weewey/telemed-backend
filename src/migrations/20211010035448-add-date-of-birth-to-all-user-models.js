module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Patients", "dateOfBirth", {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: new Date(1992, 0, 1),
        }, { transaction: t }),
        queryInterface.addColumn("Admins", "dateOfBirth", {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: new Date(1992, 0, 1),
        }, { transaction: t }),
        queryInterface.addColumn("Doctors", "dateOfBirth", {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: new Date(1992, 0, 1),
        }, { transaction: t }),
        queryInterface.addColumn("ClinicStaffs", "dateOfBirth", {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: new Date(1992, 0, 1),
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Patients", "dateOfBirth", { transaction: t }),
        queryInterface.removeColumn("Admins", "dateOfBirth", { transaction: t }),
        queryInterface.removeColumn("Doctors", "dateOfBirth", { transaction: t }),
        queryInterface.removeColumn("ClinicStaffs", "dateOfBirth", { transaction: t }),
      ]);
    });
  },
};
