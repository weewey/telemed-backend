module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Doctors", "zoomUserId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn("Doctors", "zoomUserId");
  },
};
