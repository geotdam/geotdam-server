"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("places", "sequence"); // 원래 컬럼 제거
        await queryInterface.addColumn("placeroutes", "sequence", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("places", "sequence", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.removeColumn("placeroutes", "sequence");
    }
}