'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. users
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING },
      nickname: { type: Sequelize.STRING },
      birth: { type: Sequelize.DATE },
      gender: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      is_location_shared: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE },
      status: { type: Sequelize.STRING },
      kakao_id: { type: Sequelize.STRING, unique: true },
      email: { type: Sequelize.STRING, allowNull: true, unique: true }
    });

    // 2. socialLogins
    await queryInterface.createTable('socialLogins', {
      social_login_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      access_token: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      platform: { type: Sequelize.STRING }
    });

    // 3. userImgs
    await queryInterface.createTable('userImgs', {
      user_profile_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      image_url: { type: Sequelize.STRING }
    });

    // 4. routes
    await queryInterface.createTable('routes', {
      route_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      avg_rates: { type: Sequelize.FLOAT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 5. routeImgs
    await queryInterface.createTable('routeImgs', {
      route_img_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      route_id: {
        type: Sequelize.BIGINT,
        references: { model: 'routes', key: 'route_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      route_img_url: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 6. routeLikes
    await queryInterface.createTable('routeLikes', {
      like_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      route_id: {
        type: Sequelize.BIGINT,
        references: { model: 'routes', key: 'route_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      is_liked: { type: Sequelize.BOOLEAN },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 7. routeBookmarks
    await queryInterface.createTable('routeBookmarks', {
      bookmark_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      route_id: {
        type: Sequelize.BIGINT,
        references: { model: 'routes', key: 'route_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      is_bookmarked: { type: Sequelize.BOOLEAN },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 8. reviews
    await queryInterface.createTable('reviews', {
      review_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      route_id: {
        type: Sequelize.BIGINT,
        references: { model: 'routes', key: 'route_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      comment: { type: Sequelize.TEXT },
      rates: { type: Sequelize.FLOAT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 9. places
    await queryInterface.createTable('places', {
      place_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      location: { type: Sequelize.TEXT },
      address: { type: Sequelize.TEXT },
      sequence: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 10. placeImgs
    await queryInterface.createTable('placeImgs', {
      place_img_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      place_id: {
        type: Sequelize.BIGINT,
        references: { model: 'places', key: 'place_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      place_img_url: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 11. placeRoutes
    await queryInterface.createTable('placeRoutes', {
      place_route_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      route_id: {
        type: Sequelize.BIGINT,
        references: { model: 'routes', key: 'route_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      place_id: {
        type: Sequelize.BIGINT,
        references: { model: 'places', key: 'place_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      is_primary_place: { type: Sequelize.BOOLEAN }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('placeRoutes');
    await queryInterface.dropTable('placeImgs');
    await queryInterface.dropTable('places');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('routeBookmarks');
    await queryInterface.dropTable('routeLikes');
    await queryInterface.dropTable('routeImgs');
    await queryInterface.dropTable('routes');
    await queryInterface.dropTable('userImgs');
    await queryInterface.dropTable('socialLogins');
    await queryInterface.dropTable('users');
  }
};
