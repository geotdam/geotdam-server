//루트 북마크
export default (sequelize, DataTypes) => {
  const RouteBookmarks = sequelize.define('RouteBookmarks', {
    bookmarkId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'bookmark_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    isBookmarked: {
      type: DataTypes.BOOLEAN,
      field: 'is_bookmarked'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    tableName: 'routeBookmarks',
    timestamps: false
  });

  Users.associate = (models) => {
  RouteBookmarks.belongsTo(models.Users, { foreignKey: 'userId' });
  RouteBookmarks.belongsTo(models.Routes, { foreignKey: 'routeId' });
  };
  return RouteBookmarks;
};

