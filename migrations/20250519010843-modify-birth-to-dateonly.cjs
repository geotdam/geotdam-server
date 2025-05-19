'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "birth", {
      type: Sequelize.DATEONLY,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "birth", {
      type: Sequelize.DATE, // 이전 상태로 복구
    });
  },
};
