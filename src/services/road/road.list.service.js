import models from "../../models/index.js";
import { Op } from "sequelize";

// 내가 만든 루트
export const getRoutesByOwner = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const routes = await models.Routes.findAll({
    where: { userId },
    include: [{ model: models.RouteImgs, attributes: ['routeImgUrl'] }],
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return routes.map(route => ({
    routeId: route.routeId,
    name: route.name,
    avgRates: route.avgRates,
    createdAt: route.createdAt,
    routeImgUrl: route.RouteImgs?.[0]?.routeImgUrl || null,
  }));
};

// 특정 사용자가 만든 루트
export const getRoutesByUser = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const routes = await models.Routes.findAll({
    where: { userId },
    include: [
      { model: models.Users, attributes: ['nickname'] },
      { model: models.RouteImgs, attributes: ['routeImgUrl'] }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return routes.map(route => ({
    routeId: route.routeId,
    name: route.name,
    avgRates: route.avgRates,
    createdAt: route.createdAt,
    routeImgUrl: route.RouteImgs?.[0]?.routeImgUrl || null,
    creatorNickname: route.User?.nickname || null
  }));
};

// 전체 루트 (무한스크롤)
export const getAllRoutes = async ({ cursor, limit = 10, sort = 'latest' }) => {
  const whereClause = cursor ? { routeId: { [Op.lt]: cursor } } : {};

  const order = sort === 'popular'
    ? [['avgRates', 'DESC']]
    : [['createdAt', 'DESC'], ['routeId', 'DESC']];

  const routes = await models.Routes.findAll({
    where: whereClause,
    include: [
      { model: models.Users, attributes: ['nickname'] },
      { model: models.RouteImgs, attributes: ['routeImgUrl'] }
    ],
    order,
    limit
  });

  const nextCursor = routes.length > 0 ? routes[routes.length - 1].routeId : null;

  return {
    results: routes.map(route => ({
      routeId: route.routeId,
      name: route.name,
      avgRates: route.avgRates,
      createdAt: route.createdAt,
      routeImgUrl: route.RouteImgs?.[0]?.routeImgUrl || null,
      creatorNickname: route.User?.nickname || null
    })),
    nextCursor
  };
};