import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class Users extends Sequelize.Model {}

Users.init(
  {
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id'
    },
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    birth: DataTypes.DATE,
    gender: DataTypes.STRING,
    address: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    status: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    },
    isLocationShared: {
      type: DataTypes.BOOLEAN,
      field: 'is_location_shared'
    }
  },
  {
    sequelize, // sequelize 인스턴스를 전달
    modelName: 'Users', // 모델 이름
    tableName: 'users', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
Users.hasOne(Sequelize.models.SocialLogins, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Users.hasOne(Sequelize.models.UserImgs, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Users.hasMany(Sequelize.models.Routes, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Users.hasMany(Sequelize.models.RouteLikes, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Users.hasMany(Sequelize.models.RouteBookmarks, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Users.hasMany(Sequelize.models.Reviews, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Users;
