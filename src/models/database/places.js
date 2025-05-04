//장소
export default (sequelize, DataTypes) => {
    const Places = sequelize.define('Places', {
      placeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'place_id'
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      sequence: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      location: DataTypes.TEXT,
      address: DataTypes.TEXT
    }, {
      tableName: 'places',
      timestamps: false
    });
  
    Places.associate = function(models) {
      Places.hasMany(models.placeImgs, { foreignKey: 'placeId' });
      Places.belongsToMany(models.routes, {
        through: models.placeRoutes,
        foreignKey: 'placeId',
        otherKey: 'routeId'
      });
    };
  
    return Places;
  };
  