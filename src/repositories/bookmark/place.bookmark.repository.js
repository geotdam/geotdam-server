import models from "../../models/index.js";

export const createBookmark = async ({ userId, placeId }) => {
  return await models.PlaceBookmarks.create({
    user_id: userId, // 누락된 사용자 ID 추가
    place_id: placeId,
  });
};

export const findBookmark = async ({ userId, placeId }) => {
  return await models.PlaceBookmarks.findOne({
    where: {
      user_id: userId, // 사용자 조건 추가
      place_id: placeId,
    },
  });
};

export const findPlaceBookmarksByCursor = async ({ userId, cursor, limit }) => {
  const where = {
    user_id: userId,
  };

  if (cursor) {
    where.place_bookmark_id = {
      [models.Sequelize.Op.lt]: cursor, // 커서보다 작은 ID (내림차순 기준)
    };
  }

  const bookmarks = await models.PlaceBookmarks.findAll({
    where,
    include: [
      {
        model: models.Places,
        attributes: ['name', 'tmapPlaceId']  // 필요한 필드만 선택
      },
    ],
    order: [["place_bookmark_id", "DESC"]],
    limit,
  });

  return bookmarks;
};