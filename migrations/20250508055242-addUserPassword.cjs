"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
      // unique: true,  // 비밀번호는 중복 가능
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "password");
  },
};
