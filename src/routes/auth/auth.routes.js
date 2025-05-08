// src/routes/authRoutes.js
import express from 'express';
import { kakaoLogin, kakaoCallback } from '../../controllers/auth/auth.controller.js';

const router = express.Router();

router.post('/kakao', kakaoLogin);
//router.get('/api/auth/callback/kakao', kakaoLogin);
// GET 방식: 브라우저에서 리디렉션되는 실제 경로
router.get('/callback/kakao', kakaoCallback);  // 추가
export default router;
