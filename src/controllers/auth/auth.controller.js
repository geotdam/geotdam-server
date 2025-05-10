import SocialLoginService from "../../services/socialLogin/socialLogin.service.js";
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

// 새로 추가: 브라우저 리디렉션 처리용
export const kakaoCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const result = await service.kakaoLogin(code);
    // ✅ 리디렉션 후 토큰 반환 or 메인 페이지 이동 가능
    res.status(200).json(result);
    // 또는:
    // res.redirect(`http://localhost:3000/your-frontend?token=${result.token}`);
  } catch (error) {
    console.error(
      "❌ GET 카카오 콜백 오류:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "카카오 로그인 실패" });
  }
};
