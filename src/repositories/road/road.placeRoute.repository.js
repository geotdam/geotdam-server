import models from "../../models/index.js";

export const create = async ({ routeId, placeId, isPrimaryPlace, sequence }) => {
  return await models.PlaceRoutes.create({
    routeId,
    placeId,
    isPrimaryPlace,
    sequence,
  });
};
