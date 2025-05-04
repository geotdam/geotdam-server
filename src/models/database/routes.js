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
  
    Routes.belongsTo(sequelize.models.Users, { foreignKey: 'userId' });
    Routes.hasMany(sequelize.models.RouteImgs, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.RouteLikes, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.RouteBookmarks, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.Reviews, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.Places, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
    });
  
    return Routes;
  };
  