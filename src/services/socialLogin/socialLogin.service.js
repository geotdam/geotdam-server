import axios from 'axios';
import jwt from 'jsonwebtoken';
import SocialLoginRepository from '../../repositories/socialLogin/socialLogin.repository.js';
import { SocialLoginDto } from '../../dtos/socialLogin/socialLogin.dto.js';
import dayjs from 'dayjs';

export default class SocialLoginService {
  constructor() {
    this.repo = new SocialLoginRepository();
  }

  async kakaoLogin(code, state = 'normal') {
    // 1. 액세스 토큰 받기
    const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const accessToken = tokenRes.data.access_token;

    // 2. 사용자 정보 받기
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = userRes.data;
    const kakaoId = kakaoUser.id;
    const kakaoAccount = kakaoUser.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    // ❗ 옵셔널 체이닝 + fallback 처리
    const email = kakaoAccount.email || null;
    const nickname = profile.nickname || '카카오유저';
    const name = kakaoAccount.name || null;
    const gender = kakaoAccount.gender || null;

    const birthyear = kakaoAccount.birthyear || '';
    const birthday = kakaoAccount.birthday || ''; // MMDD
    const birth = kakaoAccount.birthyear && kakaoAccount.birthday ? dayjs(`${kakaoAccount.birthyear}-${kakaoAccount.birthday}`, 'YYYY-MM-DD').toDate() : null;

    // 3. DB에서 사용자 확인 or 생성
    let user = await this.repo.findByKakaoId(kakaoId);
    if (!user) {
      user = await this.repo.createUser({
          kakaoId,
          email,
          nickname,
          name,
          gender,
          birth,
          password: '',
          status: 'active',
        }
      );
    } else {
      // 이미 있던 유저
    if (user.status === 'deactivated') {
      // 비활성화된 유저가 로그인 시도
      if (state === 'normal') {
        // ── 재동의 필요: prompt=consent 를 붙인 URL 반환
        return { reconsentUrl: this._buildReconsentUrl() };
      }
      // 재동의 후 재활성화
      await this.repo.updateStatus(user.userId, 'active');
      console.log(`🔄 user_id=${user.userId} 재활성화됨`);
    }
    // 마지막 로그인 시간만 갱신
    await this.repo.updateLastLogin(user.userId);
    }

    // 4. social_logins 테이블에 저장
    const dto = new SocialLoginDto({
      userId: user.userId,
      accessToken,
      email,
      platform: 'kakao',
    });

    await this.repo.saveSocialLogin(dto);

    // 5. JWT 발급
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return { token };
  }

  _buildReconsentUrl() {
     const base = 'https://kauth.kakao.com/oauth/authorize';
     const params = new URLSearchParams({
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        response_type: 'code',
        state: 'reconsent',
        prompt: 'consent'
     });
      return `${base}?${params.toString()}`;
   }

  async deactivateInactiveUsers() {
    return await this.repo.deactivateInactiveUsers();
  }

}
