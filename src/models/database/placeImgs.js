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
        type: DataTypes.TEXT,
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
  
    PlaceImgs.associate = (models) => {
    PlaceImgs.belongsTo(models.Places, { foreignKey: 'placeId' });
    };
    return PlaceImgs;
  };
  