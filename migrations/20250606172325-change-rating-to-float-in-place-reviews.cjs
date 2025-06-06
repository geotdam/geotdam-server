'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('place_reviews', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('place_reviews', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
