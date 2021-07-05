module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Queues", "closedTicketsId", { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Queues", "closedTicketsId", {
          allowNull: false,
          defaultValue: [],
          type: Sequelize.ARRAY(Sequelize.INTEGER),
        }, { transaction: t }),
      ]);
    });
  },
};
