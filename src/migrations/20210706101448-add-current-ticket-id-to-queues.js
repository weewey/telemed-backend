module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Queues", "currentTicketId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Tickets",
        key: "id"
      }
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn("Queues", "currentTicketId");
  },
};
