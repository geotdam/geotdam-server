//auth.controller.js
import SocialLoginService from '../../services/socialLogin/socialLogin.service.js';

const service = new SocialLoginService();

export const kakaoLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await service.kakaoLogin(code);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ 카카오 로그인 오류:", error); // 실제 에러 확인
    res.status(500).json({ message: "카카오 로그인 실패" });
  }
};

export const kakaoLoginRedirect = (req, res) => {
  const authorizeUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', process.env.KAKAO_REST_API_KEY);
  authorizeUrl.searchParams.set('redirect_uri', process.env.KAKAO_REDIRECT_URI);
  authorizeUrl.searchParams.set('response_type', 'code');
  // 첫 진입은 normal
  authorizeUrl.searchParams.set('state', 'normal');
  return res.redirect(authorizeUrl.toString());
};

// 새로 추가: 브라우저 리디렉션 처리용
export const kakaoCallback = async (req, res) => {
  try {
    const { code, state = 'normal' } = req.query;
    const result = await service.kakaoLogin(code, state);

    // deactivated 상태라 재동의가 필요하면 카카오로 다시 리다이렉트
    if (result.reconsentUrl) {
      return res.redirect(result.reconsentUrl);
    }

    // 정상 로그인 완료: 프론트로 토큰 전달
    // SPA 예시: 프론트 로그인 성공 페이지로 리다이렉트
    return res.redirect(`http://localhost:3000/login-success?token=${result.token}`);
  } catch (error) {
    console.error('❌ GET 카카오 콜백 오류:', error.response?.data || error.message);
    return res.status(500).json({ message: '카카오 로그인 실패' });
  }
};
