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

// 회원정보 조회
export const findUserById = async ({ userId }) => {
  try {
    return await models.Users.findOne({
      where: { userId: userId, status: "active" },
    });
    /**
     * 일단 userId를 통해 알 수 있는 모든 컬럼들 다 제공하도록 출력 했구여,
     * 혹시 추후에 "이건 좀 뺍시다~ 너무 보안상 안좋을 것 같아여" 싶은 건 리펙토링 때 include로 수정할게여 -이안
     */
  } catch (error) {
    throw new Error("사용자 조회 중 오류가 발생하였습니다.");
  }
};

// 회원정보 수정
export const updateUser = async ({ userId, updateData }) => {
  try {
    const [updateInfo] = await models.Users.update(updateData, {
      where: { userId: userId, status: "active" },
    });

    if (updateInfo === 0)
      throw new Error("회원정보 업데이트에 실패하였습니다. 다시 시도해주세요.");

    return await models.Users.findOne({
      where: { userId: userId },
      attributes: { exclude: ["password"] }, // 비번
    });
  } catch (error) {
    throw new Error("회원정보 수정 실패: " + error.message);
  }
};
