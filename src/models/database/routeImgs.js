//루트 이미지
export default (sequelize, DataTypes, models) => {
  const RouteImgs = sequelize.define('RouteImgs', {
    routeImgId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'route_img_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    routeImgUrl: {
      type: DataTypes.STRING,
      field: 'route_img_url'
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
    tableName: 'routeImgs',
    timestamps: false
  });

  RouteImgs.belongsTo(models.routes, { foreignKey: 'routeId' });

  return RouteImgs;
};

