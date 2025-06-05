'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. places 테이블에 외부 별점 관련 컬럼 추가
    await queryInterface.addColumn('places', 'external_rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('places', 'external_rating_participant', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('places', 'corrected_rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    // 2. place_reviews 테이블 생성
    await queryInterface.createTable('place_reviews', {
      review_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      place_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'places',
          key: 'place_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // 롤백 순서 주의 (외래키 때문에)
    await queryInterface.dropTable('place_reviews');
    await queryInterface.removeColumn('places', 'external_rating');
    await queryInterface.removeColumn('places', 'external_rating_participant');
    await queryInterface.removeColumn('places', 'corrected_rating');
  },
};
