import { DataTypes } from "sequelize";

export default (sequelize, DataTypes) => {
  const SequelizeMeta = sequelize.define(
    "SequelizeMeta",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "SequelizeMeta",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "name" }],
        },
        {
          name: "name",
          unique: true,
          using: "BTREE",
          fields: [{ name: "name" }],
        },
      ],
    }
  );

  return SequelizeMeta;
};
