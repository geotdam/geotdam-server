//장소 이미지 
export default (sequelize, DataTypes) => {
    const PlaceImgs = sequelize.define('PlaceImgs', {
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
    }, {
      tableName: 'placeImgs',
      timestamps: false
    });
  
    
  // sequelize.models 확인
  console.log('sequelize.models:', sequelize.models);

  // Places 모델이 정의되어 있는지 확인
  if (sequelize.models.Places) {
    console.log('Places model is defined:', sequelize.models.Places);
    PlaceImgs.belongsTo(sequelize.models.Places, { foreignKey: 'placeId' });
  } else {
    console.error('Places model is missing!');
  }
  
    return PlaceImgs;
  };
  