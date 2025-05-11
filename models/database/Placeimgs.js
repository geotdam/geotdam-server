import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Placeimgs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    placeImgId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'place_img_id'
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
    placeImgUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'place_img_url'
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
    tableName: 'placeimgs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "place_img_id" },
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
