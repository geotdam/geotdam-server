// 장소 북마크
export default (sequelize, DataTypes) => {
  const PlaceBookmarks = sequelize.define(
    "PlaceBookmarks",
    {
      placebookmarkId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: "place_bookmark_id",
      },
      userId: {
        type: DataTypes.BIGINT,
        field: "user_id",
      },
      placeId: {
        type: DataTypes.BIGINT,
        field: "place_id",
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
      tableName: "placeBookmarks",
      timestamps: false,
    }
  );

  PlaceBookmarks.associate = (models) => {
    PlaceBookmarks.belongsTo(models.Users, { foreignKey: "user_id" });
    PlaceBookmarks.belongsTo(models.Places, { foreignKey: "place_id" });
  };
  return PlaceBookmarks;
};
