import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Sociallogins extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    socialLoginId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'social_login_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    accessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'access_token'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sociallogins',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "social_login_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
