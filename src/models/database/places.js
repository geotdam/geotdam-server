import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
  class Places extends Sequelize.Model {} // Sequelize.Model을 상속

  Places.init(
    {
      placeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'place_id'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      sequence: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      location: {
        type: DataTypes.TEXT
      },
      address: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize, // sequelize 인스턴스를 전달
      modelName: "Places", // 모델 이름
      tableName: "places", // 테이블 이름
      timestamps: false // createdAt, updatedAt 자동 생성 방지
    }
  );

  // 관계 설정
  Places.hasMany(sequelize.models.PlaceImgs, {
    foreignKey: "placeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  Places.hasMany(sequelize.models.Routes, {
    foreignKey: "placeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });

  return Places;
};
