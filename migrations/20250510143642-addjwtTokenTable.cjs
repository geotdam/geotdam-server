"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jwtToken", {
      jwt_token_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      jwt_token: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "users", // users 테이블과 연결
          key: "user_id", // users.user_id 컬럼 참조
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });

    // 인덱스 추가
    await queryInterface.addIndex("jwtToken", ["user_id"], {
      name: "jwt_token_users_user_id_fk",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("jwtToken", "jwt_token_users_user_id_fk");
    await queryInterface.dropTable("jwtToken");
  },
};
