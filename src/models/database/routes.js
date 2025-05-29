// 루트 
export default (sequelize, DataTypes) => {
  const Routes = sequelize.define('Routes', {
    routeId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'route_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    avgRates: {
      type: DataTypes.FLOAT,
      field: 'avg_rates'
    }
  }, {
    tableName: 'routes',
    timestamps: false
  });

  Routes.associate = (models) => {
    Routes.belongsTo(models.Users, { foreignKey: 'userId' });
    Routes.hasMany(models.RouteImgs, {
      foreignKey: 'routeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Routes.hasMany(models.RouteLikes, {
      foreignKey: 'routeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Routes.hasMany(models.RouteBookmarks, {
      foreignKey: 'routeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Routes.hasMany(models.Reviews, {
      foreignKey: 'routeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Routes.hasMany(models.PlaceRoutes, { 
      foreignKey: 'routeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }); // place랑 잘못 연결 되어있어서 placeroutes로 수정
  };
  return Routes;
};
