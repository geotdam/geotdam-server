const axios = require('axios');
const KakaoLoginDTO = require('../dtos/kakaoLogin.dto');
const userRepository = require('../repositories/userRepository');
const socialLoginRepository = require('../repositories/socialLoginRepository');
const jwt = require('../utils/jwt');

exports.handleKakaoLogin = async (rawCode) => {
  const dto = new KakaoLoginDTO({ code: rawCode });

  const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      code: dto.code,
      client_secret: process.env.KAKAO_CLIENT_SECRET
    },
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });

  const accessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const kakaoUser = userResponse.data;
  const email = kakaoUser.kakao_account.email;

  let user = await userRepository.findUserByEmail(email);
  if (!user) {
    user = await userRepository.createUser({
      email: email,
      nickname: kakaoUser.kakao_account.profile.nickname || '카카오유저'
    });
  }

  await socialLoginRepository.upsertSocialLogin({
    userId: user.userId,
    accessToken,
    email,
    platform: 'kakao'
  });

  return {
    token: jwt.generateToken({ userId: user.userId, email: user.email })
  };
};
