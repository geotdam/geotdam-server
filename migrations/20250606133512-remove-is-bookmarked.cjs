"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("routeBookmarks", "is_bookmarked");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("routeBookmarks", "is_bookmarked", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // 기존 제약조건에 맞게 수정
    });
  },
};
