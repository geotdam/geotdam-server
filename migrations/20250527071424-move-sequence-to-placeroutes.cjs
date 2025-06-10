"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // places 테이블에 sequence 컬럼이 있는지 확인하고 제거
    const placesTable = await queryInterface.describeTable('places');
    if (placesTable.sequence) {
      await queryInterface.removeColumn('places', 'sequence');
    }
    // 정확한 테이블명 'placeRoutes'로 수정
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
