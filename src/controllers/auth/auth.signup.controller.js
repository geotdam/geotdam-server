import * as authService from "../../services/auth/auth.signup.service.js";

// 일반 회원가입
export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 일반 로그인
export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 회원정보 조회하기
export const userInfo = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });

    // 콩ㄴ솔로 userId 확인용 -> ㄱㅊ
    // console.log("userId: " + userId);

    const user = await authService.getUserInfo({ userId });
    res.status(200).json(user);
  } catch (e) {
    const statusCode = e.message === "사용자를 찾을 수 없습니다." ? 404 : 500;
    res.status(statusCode).json({ message: e.message });
  }
};

// 회원정보 수정하기
export const update = async (req, res) => {
  try {
    const result = await authService.update(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
