import db from "../../models/index.js";

export const findRouteById = async (routeId) => {
  return await db.Routes.findByPk(routeId);
}; // 루트 존재 여부만 일단 확인하기 
