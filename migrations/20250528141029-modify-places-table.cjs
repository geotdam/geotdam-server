"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // description 삭제
    await queryInterface.removeColumn("places", "description");

    // phone 추가
    await queryInterface.addColumn("places", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // opening_hours 추가
    await queryInterface.addColumn("places", "open_hours", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // location 타입 TEXT → POINT
    await queryInterface.changeColumn("places", "location", {
      type: Sequelize.GEOMETRY("POINT"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // location
    await queryInterface.changeColumn("places", "location", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.removeColumn("places", "opening_hours");
    await queryInterface.removeColumn("places", "phone");

    // description 복구
    await queryInterface.addColumn("places", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
