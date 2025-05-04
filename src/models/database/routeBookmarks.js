import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class RouteBookmarks extends Sequelize.Model {}

RouteBookmarks.init(
  {
    bookmarkId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'bookmark_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    isBookmarked: {
      type: DataTypes.BOOLEAN,
      field: 'is_bookmarked'
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
    modelName: 'RouteBookmarks', // 모델 이름
    tableName: 'routeBookmarks', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
RouteBookmarks.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });
RouteBookmarks.belongsTo(Sequelize.models.Routes, { foreignKey: 'routeId' });

export default RouteBookmarks;
