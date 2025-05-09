import db from '../../models/index.js';
import { Op } from 'sequelize';
import dayjs from 'dayjs';

export default class SocialLoginRepository {
  async findByKakaoId(kakaoId) {
    return await db.Users.findOne({ where: { kakao_id: kakaoId } });
  }

  async createUser({ kakaoId, email, nickname, name, gender, birth, status }) {
    return await db.Users.create({
      kakaoId: kakaoId,
      email: email,
      nickname: nickname,
      name,
      gender,
      birth,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  async updateLastLogin(userId) {
    await db.Users.update(
      { updated_at: new Date() },
      { where: { user_id: userId } }
    );
  }

  async saveSocialLogin(dto) {
    return await db.SocialLogins.create({
      userId: dto.userId,
      accessToken: dto.accessToken,
      email: dto.email,
      platform: dto.platform,
    });
  }

  // ✅ 추가: 1년 이상 로그인 안 한 유저 비활성화 처리
  async deactivateInactiveUsers() {
    const oneYearAgo = dayjs().subtract(1, 'year').toDate();

    await db.Users.update(
      { status: 'deactivated' },
      {
        where: {
          updated_at: { [Op.lt]: oneYearAgo },
          status: 'active',
        },
      }
    );
  }
}
