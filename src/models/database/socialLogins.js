import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class SocialLogins extends Sequelize.Model {}

SocialLogins.init(
  {
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
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'SocialLogins', // 모델 이름
    tableName: 'socialLogins', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
SocialLogins.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });

export default SocialLogins;
