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

  RouteBookmarks.belongsTo(models.users, { foreignKey: 'userId' });
  RouteBookmarks.belongsTo(models.routes, { foreignKey: 'routeId' });

  return RouteBookmarks;
};

