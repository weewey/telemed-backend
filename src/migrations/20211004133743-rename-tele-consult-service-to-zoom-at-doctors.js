module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameColumn("Tickets", "teleConsultMeetingId",
          "zoomMeetingId",
          { transaction: t }),
        queryInterface.renameColumn("Tickets", "teleConsultStartMeetingUrl",
          "zoomStartMeetingUrl",
          { transaction: t }),
        queryInterface.renameColumn("Tickets", "teleConsultJoinMeetingUrl",
          "zoomJoinMeetingUrl",
          { transaction: t }),
      ]);
    });
  },
};

//
