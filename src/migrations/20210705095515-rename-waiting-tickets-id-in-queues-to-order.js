module.exports = {
  up: async (queryInterface) => {
    return queryInterface.renameColumn("Queues", "waitingTicketsId", "order");
  },

  down: async (queryInterface) => {
    return queryInterface.renameColumn("Queues", "order", "waitingTicketsId");
  },
};
