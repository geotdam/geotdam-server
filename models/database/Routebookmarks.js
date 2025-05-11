import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Routebookmarks extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    bookmarkId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'bookmark_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'routes',
        key: 'route_id'
      },
      field: 'route_id'
    },
    isBookmarked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_bookmarked'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'routebookmarks',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bookmark_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "route_id",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
    ]
  });
  }
}
