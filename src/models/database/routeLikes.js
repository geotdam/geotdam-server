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

  RouteLikes.associate = (models) => {
  RouteLikes.belongsTo(models.Users, { foreignKey: 'userId' });
  RouteLikes.belongsTo(models.Routes, { foreignKey: 'routeId' });
  };
  return RouteLikes;
};
