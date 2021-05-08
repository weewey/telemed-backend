'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mobileNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      authId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      onDuty: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      clinicId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Clinics',
          key: 'id'
        }
      },
      queueId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Queues',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Doctors');
  }
};