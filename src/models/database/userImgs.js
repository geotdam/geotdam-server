//유저 이미지 
export default (sequelize, DataTypes, models) => {
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

  UserImgs.belongsTo(sequelize.models.Users, { foreignKey: 'userId' });
  
  return UserImgs;
};
