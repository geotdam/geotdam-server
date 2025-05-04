//소셜 로그인 
export default (sequelize, DataTypes, models) => {
  const SocialLogins = sequelize.define('SocialLogins', {
    socialLoginId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'social_login_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    accessToken: {
      type: DataTypes.STRING,
      field: 'access_token'
    },
    email: DataTypes.STRING,
    platform: DataTypes.STRING
  }, {
    tableName: 'socialLogins',
    timestamps: false
  });

  SocialLogins.belongsTo(models.users, { foreignKey: 'userId' });

  return SocialLogins;
};
