// src/repositories/socialLogin/socialLogin.repository.js
import db from '../../models/index.js';
import { Op } from 'sequelize';
import dayjs from 'dayjs';

export default class SocialLoginRepository {
  async findByEmail(email) {
    return await db.Users.findOne({ where: { email } });
  }

  // async updateGoogleId(userId, googleId) {
  //   return await db.Users.update({ google_id: googleId }, { where: { userId } });
  // }

  // async updateKakaoId(userId, kakaoId) {
  //   return await db.Users.update({ kakao_id: kakaoId }, { where: { userId } });
  // }
  
  async createUser({ email, nickname, name, gender, birth, status, password }) {
  return await db.Users.create({
    email,
    nickname,
    name,
    gender,
    birth: birth ? new Date(birth) : null,
    password,
    status,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

  async updateLastLogin(userId) {
    try {
      await db.Users.update(
        { updatedAt: new Date() },  // ✅ updated_at 대신 모델 필드명 사용
        { where: { userId } }
      );
    } catch (error) {
      console.error('🛑 로그인 시간 업데이트 실패:', error);
      throw error;
    }
  }

  async updateStatus(userId, newStatus) {
     return await db.Users.update(
        { status: newStatus, updated_at: new Date() },
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
    try {
      const oneYearAgo = dayjs().subtract(1, 'year').toDate();
  
      const [affectedRows] = await db.Users.update(
        { status: 'deactivated' },
        {
          where: {
            updatedAt: { [Op.lt]: oneYearAgo },
            status: 'active',
          },
        }
      );
  
      console.log(`✅ ${affectedRows}명의 유저가 비활성화되었습니다.`);
    } catch (error) {
      console.error('🛑 비활성화 처리 중 오류 발생:', error);
      throw error;
    }
  }
  
}