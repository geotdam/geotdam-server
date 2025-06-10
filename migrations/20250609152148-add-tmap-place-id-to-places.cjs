"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("places", "tmap_place_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // 마이그레이션 파일 예시 (인덱스 추가)
    await queryInterface.addIndex("places", ["tmap_place_id"], {
      name: "places_tmap_place_id_idx",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("places", "tmap_place_id");
  },
};
