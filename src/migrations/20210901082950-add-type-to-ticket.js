module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Tickets", "type", {
          allowNull: false,
          type: Sequelize.ENUM,
          values: [ "PHYSICAL", "TELEMED" ],
          defaultValue: "PHYSICAL",
        }, { transaction: t }),
        queryInterface.sequelize.query("alter table \"Tickets\" alter column \"type\" drop default;",
          { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Tickets", "type", { transaction: t }),
        queryInterface.sequelize.query("DROP TYPE \"enum_Tickets_type\";", { transaction: t }),
      ]);
    });
  },
};

//
