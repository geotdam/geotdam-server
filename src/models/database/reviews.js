import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class Reviews extends Sequelize.Model {}

Reviews.init(
  {
    reviewId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'review_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    comment: DataTypes.TEXT,
    rates: DataTypes.FLOAT,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'Reviews', // 모델 이름
    tableName: 'reviews', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
Reviews.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });
Reviews.belongsTo(Sequelize.models.Routes, { foreignKey: 'routeId' });

export default Reviews;
