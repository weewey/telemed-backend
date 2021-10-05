module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Tickets", "zoomMeetingPassword", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Tickets", "zoomMeetingPassword", { transaction: t }),
      ]);
    });
  },
};
