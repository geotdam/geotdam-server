import models from "../../models/index.js";

export const create = async ({ placeId, placeImgUrl }) => {
  return await models.PlaceImgs.create({
    placeId,
    placeImgUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const findOneByPlaceId = async (placeId) => {
  return await models.PlaceImgs.findOne({
    where: { placeId },
  });
};