module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Queues", "doctorId",
      { type: Sequelize.INTEGER,
        references: { model: "Doctors", key: "id" } });
  },

  down: async (queryInterface) => {
    return queryInterface.addColumn("Queues",
      "doctorId");
  },
};
