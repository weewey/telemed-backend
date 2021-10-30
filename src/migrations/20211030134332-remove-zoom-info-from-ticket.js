module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Tickets", "zoomMeetingId", { transaction: t }),
        queryInterface.removeColumn("Tickets", "zoomStartMeetingUrl", { transaction: t }),
        queryInterface.removeColumn("Tickets", "zoomJoinMeetingUrl", { transaction: t }),
        queryInterface.removeColumn("Tickets", "zoomMeetingPassword", { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Tickets", "zoomMeetingId", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn("Tickets", "zoomStartMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn("Tickets", "zoomJoinMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn("Tickets", "zoomMeetingPassword", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
      ]);
    });
  },

};
