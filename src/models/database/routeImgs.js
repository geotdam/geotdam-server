import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class RouteImgs extends Sequelize.Model {}

RouteImgs.init(
  {
    routeImgId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'route_img_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    routeImgUrl: {
      type: DataTypes.STRING,
      field: 'route_img_url'
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
    modelName: 'RouteImgs', // 모델 이름
    tableName: 'routeImgs', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
RouteImgs.belongsTo(Sequelize.models.Routes, { foreignKey: 'routeId' });

export default RouteImgs;
