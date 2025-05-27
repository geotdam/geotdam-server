import db from "../../models/index.js";
import { Op, fn, col, literal } from "sequelize";

//루트 키워드로 검색하기 
export const findRoadByKeyword = async (keyword, offset = 0, limit = 6) => {
  return await db.Routes.findAndCountAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    },
    attributes: [
      ['route_id', 'routeId'],
      'name',
      'description',
      [fn("COUNT", literal("DISTINCT RouteLikes.like_id")), "like_count"],
      [fn("COUNT", literal("DISTINCT Reviews.review_id")), "review_count"]
    ],
    include: [
      {
        model: db.RouteImgs,
        as: "RouteImgs",
        attributes: ["route_img_url"],
        limit: 1
      },
      {
        model: db.RouteLikes,
        as: "RouteLikes",
        attributes: [],
        where: { is_liked: true },
        required: false
      },
      {
        model: db.Reviews,
        as: "Reviews",
        attributes: [],
        required: false
      }
    ],
    group: ["Routes.route_id"],
    offset,
    limit,
    subQuery: false
  });
};

// 썸네일 조회 함수 추가하기 
export const getThumbnailByRouteId = async (routeId) => {
  if (!routeId) {
    console.warn("❗ invalid routeId passed to getThumbnailByRouteId:", routeId);
    return null;
  }

  const thumbnail = await db.RouteImgs.findOne({
    where: { route_id: routeId },
    attributes: ["route_img_url"]
  });

  return thumbnail?.get("route_img_url") || null;
};