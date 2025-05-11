import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Placeroutes extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    placeRouteId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'place_route_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'routes',
        key: 'route_id'
      },
      field: 'route_id'
    },
    placeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'places',
        key: 'place_id'
      },
      field: 'place_id'
    },
    isPrimaryPlace: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_primary_place'
    }
  }, {
    sequelize,
    tableName: 'placeroutes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "place_route_id" },
        ]
      },
      {
        name: "route_id",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "place_id",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
    ]
  });
  }
}
