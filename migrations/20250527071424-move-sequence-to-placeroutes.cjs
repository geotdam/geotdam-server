"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
    // 컬럼 존재 여부 확인 후 삭제
    const table = await queryInterface.describeTable('places');
    if (table.sequence) {
        await queryInterface.removeColumn('places', 'sequence');
    }
    await queryInterface.addColumn('placeroutes', 'sequence', {
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
