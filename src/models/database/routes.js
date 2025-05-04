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
  
<<<<<<< HEAD
    Routes.associate = (models) => {
    Routes.belongsTo(models.Users, { foreignKey: 'userId' });
    Routes.hasMany(models.RouteImgs, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(models.RouteLikes, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(models.RouteBookmarks, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(models.Reviews, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(models.Places, { foreignKey: 'routeId',
=======
    Routes.belongsTo(sequelize.models.users, { foreignKey: 'userId' });
    Routes.hasMany(sequelize.models.routeImgs, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.routeLikes, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.routeBookmarks, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.reviews, { foreignKey: 'routeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Routes.hasMany(sequelize.models.places, { foreignKey: 'routeId',
>>>>>>> 209d3a7 (fix: sequlize instance 적용)
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
    });
    };
    return Routes;
  };
  