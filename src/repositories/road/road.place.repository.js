import models from "../../models/index.js";

export const create = async ({ name, description, location, address }) => {
  try {
    const newPlace = await models.Places.create({
      name,
      description,
      location,
      address,
    });
    return newPlace;
  } catch (error) {
    throw error;
  }
};
