//장소 루트
export default (sequelize, DataTypes) => {
    const PlaceRoutes = sequelize.define('PlaceRoutes', {
      placeRouteId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'place_route_id'
      },
      routeId: {
        type: DataTypes.BIGINT,
        field: 'route_id'
      },
      placeId: {
        type: DataTypes.BIGINT,
        field: 'place_id'
      },
      isPrimaryPlace: {
        type: DataTypes.BOOLEAN,
        field: 'is_primary_place'
      },
      sequence: {
        type: DataTypes.BIGINT,
        field: 'sequence'
      },
    }, {
      tableName: 'placeRoutes',
      timestamps: false
    });
  
    PlaceRoutes.associate = (models) => {
    PlaceRoutes.belongsTo(models.Routes, { foreignKey: 'routeId' });
    PlaceRoutes.belongsTo(models.Places, { foreignKey: 'placeId' });
    };
    return PlaceRoutes;
  };
  