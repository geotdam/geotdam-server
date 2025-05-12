// jwtToken.js
export default (sequelize, DataTypes) => {
  const JwtToken = sequelize.define(
    "JwtToken",
    {
      jwtTokenId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false, // 필수값
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

  // (필요하다면 관계 설정)
  JwtToken.associate = (models) => {
    JwtToken.belongsTo(models.Users, { foreignKey: "userId" });
  };

  return JwtToken;
};
