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
  
    Routes.associate = function(models) {
      Routes.belongsTo(models.users, { foreignKey: 'userId' });
      Routes.hasMany(models.routeImgs, { foreignKey: 'routeId' });
      Routes.hasMany(models.routeLikes, { foreignKey: 'routeId' });
      Routes.hasMany(models.routeBookmarks, { foreignKey: 'routeId' });
      Routes.hasMany(models.reviews, { foreignKey: 'routeId' });
      Routes.belongsToMany(models.places, {
        through: models.placeRoutes,
        foreignKey: 'routeId',
        otherKey: 'placeId'
      });
    };
  
    return Routes;
  };
  