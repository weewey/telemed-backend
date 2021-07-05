module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Queues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clinicId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Clinics",
          key: "id",
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [ "ACTIVE", "INACTIVE", "CLOSED" ],
      },
      waitingTicketsId: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      closedTicketsId: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      latestGeneratedTicketDisplayNumber: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      startedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      closedAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Queues");
  },
};
