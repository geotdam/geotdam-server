import models from "../../models/index.js";

export const create = async ({ routeId, routeImgUrl }) => {
  return await models.RouteImgs.create({
    routeId,
    routeImgUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};