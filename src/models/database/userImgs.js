//유저 이미지 
module.exports = (sequelize, DataTypes) => {
  const UserImgs = sequelize.define('UserImgs', {
    userProfileId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_profile_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    imageUrl: {
      type: DataTypes.STRING,
      field: 'image_url'
    }
  }, {
    tableName: 'userImgs',
    timestamps: false
  });

  UserImgs.associate = function(models) {
    UserImgs.belongsTo(models.users, { foreignKey: 'userId' });
  };

  return UserImgs;
};
