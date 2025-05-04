import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class UserImgs extends Sequelize.Model {}

UserImgs.init(
  {
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
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'UserImgs', // 모델 이름
    tableName: 'userImgs', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
UserImgs.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });

export default UserImgs;
