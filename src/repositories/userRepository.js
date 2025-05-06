const { users } = require('../models');

const findUserByEmail = async (email) => {
  return await users.findOne({ where: { email } });
};

const createUser = async (userData) => {
  return await users.create(userData);
};

module.exports = {
  findUserByEmail,
  createUser
};
