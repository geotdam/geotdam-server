import axios from 'axios';
import jwt from 'jsonwebtoken';
import SocialLoginRepository from '../../repositories/socialLogin/socialLogin.repository.js';
import { SocialLoginDto } from '../../dtos/socialLogin/socialLogin.dto.js';

export default class SocialLoginService {
  constructor() {
    this.repo = new SocialLoginRepository();
  }

  async kakaoLogin(code) {
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
    
    // 3. DB에서 사용자 확인 or 생성
    let user = await this.repo.findByKakaoId(kakaoId);
    if (!user) {
      user = await this.repo.createUser(kakaoId, email, nickname);
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
}
