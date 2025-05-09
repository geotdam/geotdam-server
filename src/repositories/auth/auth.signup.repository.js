import models from "../../models/index.js";

export const findByEmail = async (email) => {
  return await models.Users.findOne({ where: { email } });
};

export const createUser = async (userData) => {
  return await models.Users.create(userData);
};
