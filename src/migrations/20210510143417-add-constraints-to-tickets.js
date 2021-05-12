module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint("Tickets", {
          type: "unique",
          fields: [ "queueId", "displayNumber" ],
          name: "Tickets_queueId_displayNumber_unique_key",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Tickets", "Tickets_queueId_displayNumber_unique_key", { transaction: t }),
      ]);
    });
  },
};
