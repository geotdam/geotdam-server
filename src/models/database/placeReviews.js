// 장소 리뷰
export default (sequelize, DataTypes) => {
  const PlaceReviews = sequelize.define(
    "PlaceReviews",
    {
      reviewId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: "review_id",
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id",
      },
      placeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "place_id",
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      tableName: "place_reviews",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  PlaceReviews.associate = (models) => {
    PlaceReviews.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    PlaceReviews.belongsTo(models.Places, {
      foreignKey: "placeId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return PlaceReviews;
};
