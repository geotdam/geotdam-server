// src/routes/auth.routes.js
import express from 'express';
//const verifyToken = require('../../middlewares/verifyToken');
import { kakaoLoginRedirect, kakaoCallback } from '../../controllers/auth/auth.controller.js';

const router = express.Router();

// 1) 브라우저에서 로그인 버튼 클릭 → 카카오 동의 화면으로 리다이렉트
router.get('/kakao', kakaoLoginRedirect);

// 2) 카카오 동의 완료 후 돌아오는 콜백
router.get('/callback/kakao', kakaoCallback);


// // 예: 로그인된 사용자만 접근 가능 -> 인증이 필요한 화면은 이렇게 쓰면 될 듯 합니다
// router.get('/me', VerifyToken, (req, res) => {
//   res.json({ message: '인증 완료된 사용자입니다.', user: req.user });
// });


export default router;
