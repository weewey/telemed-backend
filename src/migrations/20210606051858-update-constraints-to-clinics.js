module.exports = {
  up: async (queryInterface) => {
    return queryInterface.addConstraint("Clinics", {
      type: "unique",
      fields: [ "name", "postalCode" ],
      name: "Clinics_name_union_postalCode_unique_key",
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeConstraint("Clinics", "Clinics_name_union_postalCode_unique_key");
  },
};
