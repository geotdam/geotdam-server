"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const placesTable = await queryInterface.describeTable('places');
    if (placesTable.sequence) {
      await queryInterface.removeColumn('places', 'sequence');
    }

    // 정확한 테이블명 'placeRoutes'로 변경
    await queryInterface.addColumn('placeRoutes', 'sequence', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('places', 'sequence', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.removeColumn('placeRoutes', 'sequence');
  }
};
