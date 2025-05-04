import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class PlaceRoutes extends Sequelize.Model {}

PlaceRoutes.init(
  {
    placeRouteId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'place_route_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    placeId: {
      type: DataTypes.BIGINT,
      field: 'place_id'
    },
    isPrimaryPlace: {
      type: DataTypes.BOOLEAN,
      field: 'is_primary_place'
    }
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'PlaceRoutes', // 모델 이름
    tableName: 'placeRoutes', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
PlaceRoutes.belongsTo(Sequelize.models.Routes, { foreignKey: 'routeId' });
PlaceRoutes.belongsTo(Sequelize.models.Places, { foreignKey: 'placeId' });

export default PlaceRoutes;
