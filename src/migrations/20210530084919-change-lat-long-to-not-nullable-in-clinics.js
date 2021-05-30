module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn("Clinics", "lat", {
          allowNull: false,
          type: Sequelize.DOUBLE,
        }, { transaction: t }),
        queryInterface.changeColumn("Clinics", "long", {
          allowNull: false,
          type: Sequelize.DOUBLE,
        }, { transaction: t }),

      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn("Clinics", "lat", {
          allowNull: true,
          type: Sequelize.DOUBLE,
        }, { transaction: t }),
        queryInterface.changeColumn("Clinics", "long", {
          allowNull: true,
          type: Sequelize.DOUBLE,
        }, { transaction: t }),
      ]);
    });
  },
};
