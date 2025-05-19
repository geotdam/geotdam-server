//소셜 로그인 
export default (sequelize, DataTypes) => {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'socialLogins',
    timestamps: false
  });

  SocialLogins.associate = (models) => {
  SocialLogins.belongsTo(models.Users, { foreignKey: 'userId', as: 'User' });
  };
  return SocialLogins;
};
