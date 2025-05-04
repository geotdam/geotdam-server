import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class RouteLikes extends Sequelize.Model {}

RouteLikes.init(
  {
    likeId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'like_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      field: 'is_liked'
    },
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
    modelName: 'RouteLikes', // 모델 이름
    tableName: 'routeLikes', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
RouteLikes.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });
RouteLikes.belongsTo(Sequelize.models.Routes, { foreignKey: 'routeId' });

export default RouteLikes;
