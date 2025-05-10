import models from "../../models/index.js";

export const findByEmail = async (email) => {
  return await models.Users.findOne({ where: { email } });
};

export const createUser = async (userData) => {
  return await models.Users.create(userData); // 유저 필드 전체 확인
};

export const saveJwtToken = async ({ userId, jwtToken }) => {
  return await models.JwtToken.create({
    userId,
    jwtToken,
  });
}; // jwt 토큰 저장해두려구여
