'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Queues', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            clinicId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Clinics',
                    key: 'id'
                }
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: ['NOT_STARTED', 'ACTIVE', 'PAUSED', 'CLOSED'],
            },
            startedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            closedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Queues');
    }
};
