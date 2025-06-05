// 장소
export default (sequelize, DataTypes) => {
  const Places = sequelize.define('Places', {
    placeId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'place_id'
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    open_hours: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT'),
    address: DataTypes.TEXT,

    // 외부 별점 정보
    externalRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'external_rating',
    },
    // 외부 별점 참여자 
    externalRatingParticipant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'external_rating_participant',
    },
    //사용자 리뷰 기반 보정된 평균 별점 
    correctedRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'corrected_rating',
    },

    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
  }, {
    tableName: 'places',
    timestamps: false
  });

  Places.associate = (models) => {
    Places.hasMany(models.PlaceImgs, {
      foreignKey: 'placeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Places.hasMany(models.PlaceRoutes, {
      foreignKey: 'placeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Places.hasMany(models.PlaceReviews, {
      foreignKey: 'placeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Places;
};
