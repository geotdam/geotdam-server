'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'kakao_id', {
      type: Sequelize.STRING,
      unique: true
    });

    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'kakao_id');
  }
};
