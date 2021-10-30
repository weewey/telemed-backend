module.exports = {
  up: async (queryInterface) => {
    return queryInterface.removeColumn("Doctors", "zoomUserId");
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Doctors", "zoomUserId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
