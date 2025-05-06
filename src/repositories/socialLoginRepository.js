const { SocialLogins } = require('../models');

const upsertSocialLogin = async (loginData) => {
  return await SocialLogins.upsert(loginData);
};

module.exports = {
  upsertSocialLogin
};
