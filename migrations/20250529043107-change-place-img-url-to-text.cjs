'use strict';

// 이미지 url이 길어서 text로 변경
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("placeImgs", "place_img_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn("routeImgs", "route_img_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("placeImgs", "place_img_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("routeImgs", "route_img_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
