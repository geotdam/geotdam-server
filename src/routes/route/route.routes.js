// src/routes/route/route.routes.js
import express from 'express';
import { createRoute } from '../../controllers/route/route.controller.js';
import authenticateJWT from '../../middlewares/authenticate.jwt.js'; // 미들웨어 import

const router = express.Router();

// JWT 인증 미들웨어 적용
router.post('/', authenticateJWT, createRoute);

export default router; 
//나만의 루트 생성
//router.get('/',컨트롤러 연결));//루트 전체 조회 (페이징)
//router.get('/{routeId}/rates',컨트롤러 연결));//루트 별점 주기  
//router.post('/search',컨트롤러 연결));//루트 검색하기 
//router.post('/{routeId}/reviews',컨트롤러 연결)); //루트 리뷰 생성  
//router.get('/{routeId}/reviews',컨트롤러 연결)); //루트 리뷰 조회 
//router.post('/{routeId}/share',컨트롤러 연결)); // 루트 sns 공유용 링크 생성 
//router.get('/{routeid}/markings',컨트롤러 연결));//내가 만든 경로의 마킹 불러오기 
//router.get('/recommends', 컨트롤러연결)
