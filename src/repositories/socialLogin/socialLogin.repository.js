import db from '../../models/index.js';

export default class SocialLoginRepository {
  async findByKakaoId(kakaoId) {
    return await db.Users.findOne({ where: { kakao_id: kakaoId } });
  }

  async createUser(kakaoId, email, nickname) {
    return await db.Users.create({
      kakaoId: kakaoId,
      email: email,
      nickname: nickname,
    });
  }

  async saveSocialLogin(dto) {
    return await db.SocialLogins.create({
      userId: dto.userId,
      accessToken: dto.accessToken,
      email: dto.email,
      platform: dto.platform,
    });
  }
}
