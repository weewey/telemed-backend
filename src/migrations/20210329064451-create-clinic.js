'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            imageUrl: {
                allowNull: true,
                type: Sequelize.STRING
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING
            },
            lat: {
                allowNull: true,
                type: Sequelize.DOUBLE
            },
            long: {
                allowNull: true,
                type: Sequelize.DOUBLE
            },
            postalCode: {
                allowNull: false,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            phoneNumber: {
                allowNull: false,
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Clinics');
    }
};