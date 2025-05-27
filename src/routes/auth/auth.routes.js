import express from "express";
import {
  kakaoLoginRedirect,
  kakaoCallback,
  googleLoginRedirect,
  googleCallback,
} from "../../controllers/auth/auth.controller.js";
import * as userController from "../../controllers/auth/auth.signup.controller.js";
import authenticateJWT from "../../middlewares/authenticate.jwt.js";

const router = express.Router();

//router.post("/kakao", kakaoLogin);
router.get("/login/kakao", kakaoLoginRedirect);
router.get("/callback/kakao", kakaoCallback);
router.get("/login/google", googleLoginRedirect);
router.get("/callback/google", googleCallback);

// 회원가입이랑 로그인은 인증 필요 없음
// 회원가입
router.post("/signup", userController.register);
// 로그인
router.post("/login", userController.login);

// 회원 정보 불러오기
router.get("/", authenticateJWT, userController.userInfo);

// 회원 정보 수정
router.put("/", authenticateJWT, userController.update);

export default router;
