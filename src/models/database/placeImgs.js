import { Sequelize, DataTypes } from "sequelize";

// Sequelize.Model을 상속하는 방식으로 변경
class PlaceImgs extends Sequelize.Model {}

PlaceImgs.init(
  {
    placeImgId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'place_img_id'
    },
    placeId: {
      type: DataTypes.BIGINT,
      field: 'place_id'
    },
    placeImgUrl: {
      type: DataTypes.STRING,
      field: 'place_img_url'
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
    modelName: 'PlaceImgs', // 모델 이름
    tableName: 'placeImgs', // 테이블 이름
    timestamps: false // createdAt, updatedAt 자동 생성 방지
  }
);

// 관계 설정
PlaceImgs.belongsTo(Sequelize.models.Places, { foreignKey: 'placeId' });

export default PlaceImgs;
