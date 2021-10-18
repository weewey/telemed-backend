module.exports = {
  up: async (queryInterface) => {
    return queryInterface.removeColumn("Doctors", "queueId");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Doctors",
      "queueId", { type: Sequelize.INTEGER,
        references: { model: "Queues", key: "id" } });
  },
};
