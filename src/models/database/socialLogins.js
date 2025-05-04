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
    email: DataTypes.STRING,
    platform: DataTypes.STRING
  }, {
    tableName: 'socialLogins',
    timestamps: false
  });

<<<<<<< HEAD
  SocialLogins.associate = (models) => {
  SocialLogins.belongsTo(models.Users, { foreignKey: 'userId' });
  };
=======
  SocialLogins.belongsTo(sequelize.models.users, { foreignKey: 'userId' });

>>>>>>> 209d3a7 (fix: sequlize instance 적용)
  return SocialLogins;
};
