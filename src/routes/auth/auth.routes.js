// src/routes/authRoutes.js
import express from "express";
import {
  kakaoLogin,
  kakaoCallback,
} from "../../controllers/auth/auth.controller.js";
import * as userController from "../../controllers/auth/auth.signup.controller.js";

const router = express.Router();

router.post("/kakao", kakaoLogin);
//router.get('/api/auth/callback/kakao', kakaoLogin);
// GET 방식: 브라우저에서 리디렉션되는 실제 경로
router.get("/callback/kakao", kakaoCallback); // 추가

// 회원가입이랑 로그인은 인증 필요 없음
// 회원가입
router.post("/signup", userController.register);
// 로그인
router.post("/login", userController.login);

export default router;
