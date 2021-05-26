module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ClinicStaffs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mobileNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinicId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Clinics",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("ClinicStaffs");
  },
};
