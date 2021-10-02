module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Tickets", "teleConsultMeetingId", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn("Tickets", "teleConsultStartMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn("Tickets", "teleConsultJoinMeetingUrl", {
          allowNull: true,
          type: Sequelize.STRING,
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Tickets", "teleConsultMeetingId", { transaction: t }),
        queryInterface.removeColumn("Tickets", "teleConsultStartMeetingUrl", { transaction: t }),
        queryInterface.removeColumn("Tickets", "teleConsultJoinMeetingUrl", { transaction: t }),
      ]);
    });
  },
};

//
