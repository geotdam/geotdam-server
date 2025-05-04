//루트 좋아요
export default (sequelize, DataTypes) => {
  const RouteLikes = sequelize.define('RouteLikes', {
    likeId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'like_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      field: 'is_liked'
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
    tableName: 'routeLikes',
    timestamps: false
  });

  RouteLikes.associate = function(models) {
    RouteLikes.belongsTo(models.users, { foreignKey: 'userId' });
    RouteLikes.belongsTo(models.routes, { foreignKey: 'routeId' });
  };

  return RouteLikes;
};
