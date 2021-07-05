module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Queues", "waitingTicketsCount", { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Queues", "waitingTicketsCount", {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.INTEGER,
        }, { transaction: t }),
      ]);
    });
  },
};
