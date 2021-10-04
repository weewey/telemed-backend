module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn("Tickets", "zoomStartMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING("4096"),
        }, { transaction: t }),
        queryInterface.changeColumn("Tickets", "zoomJoinMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING("4096"),
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn("Tickets", "zoomStartMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING("255"),
        }, { transaction: t }),
        queryInterface.changeColumn("Tickets", "zoomJoinMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING("255"),
        }, { transaction: t }),
      ]);
    });
  },
};
