module.exports = {
  up: async (queryInterface) => {
    return queryInterface.renameColumn("Queues", "order", "pendingTicketIdsOrder");
  },

  down: async (queryInterface) => {
    return queryInterface.renameColumn("Queues", "pendingTicketIdsOrder", "order");
  },
};
