module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Patients",
          key: "id",
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      displayNumber: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      clinicId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Clinics",
          key: "id",
        },
      },
      queueId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Queues",
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
    await queryInterface.dropTable("Tickets");
  },
};
