import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Routeimgs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    routeImgId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'route_img_id'
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
    routeImgUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'route_img_url'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'routeimgs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "route_img_id" },
        ]
      },
      {
        name: "route_id",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
    ]
  });
  }
}
