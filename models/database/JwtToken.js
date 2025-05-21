import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class JwtToken extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        jwtTokenId: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          field: "jwt_token_id",
        },
        jwtToken: {
          type: DataTypes.STRING(500),
          allowNull: false,
          field: "jwt_token",
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "user_id",
          references: {
            model: "users",
            key: "user_id",
          },
        },
      },
      {
        sequelize,
        tableName: "jwtToken",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "jwt_token_id" }],
          },
          {
            name: "jwt_token_users_user_id_fk",
            using: "BTREE",
            fields: [{ name: "user_id" }],
          },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
  }
}
