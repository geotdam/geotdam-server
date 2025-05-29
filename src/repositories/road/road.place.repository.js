import models from "../../models/index.js";

export const create = async ({ name, phone, open_hours, location, address }) => {
  try {
    const newPlace = await models.Places.create({
      name,
      phone,
      open_hours,
      location,
      address,
    });
    return newPlace;
  } catch (error) {
    throw error;
  }
};

export const findOneByNameAndAddress = async (name, address) => {
  return await models.Places.findOne({
    where: {
      name,
      address
    }
  });
};
