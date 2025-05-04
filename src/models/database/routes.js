import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class Routes extends Sequelize.Model {}

Routes.init(
  {
    routeId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'route_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    avgRates: {
      type: DataTypes.FLOAT,
      field: 'avg_rates'
    }
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'Routes', // 모델 이름
    tableName: 'routes', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
Routes.belongsTo(Sequelize.models.Users, { foreignKey: 'userId' });
Routes.hasMany(Sequelize.models.RouteImgs, { foreignKey: 'routeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Routes.hasMany(Sequelize.models.RouteLikes, { foreignKey: 'routeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Routes.hasMany(Sequelize.models.RouteBookmarks, { foreignKey: 'routeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Routes.hasMany(Sequelize.models.Reviews, { foreignKey: 'routeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Routes.hasMany(Sequelize.models.Places, { foreignKey: 'routeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Routes;
