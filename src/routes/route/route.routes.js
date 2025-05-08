import express from 'express';
import { } from '../../controllers/route/route.controller.js';

const router = express.Router(); 

//router.post('/api/routes', 컨트롤러 연결);//나만의 루트 생성
//router.get('/api/routes',컨트롤러 연결));//루트 전체 조회 (페이징)
//router.get('/api/routes/{routeId}/rates',컨트롤러 연결));//루트 별점 주기  
//router.post('/api/routes/search',컨트롤러 연결));//루트 검색하기 
//router.post('/api/routes/{routeId}/reviews',컨트롤러 연결)); //루트 리뷰 생성  
//router.get('/api/routes/{routeId}/reviews',컨트롤러 연결)); //루트 리뷰 조회 
//router.post('/api/routes/{routeId}/share',컨트롤러 연결)); // 루트 sns 공유용 링크 생성 
//router.get('/api/routes/{routeid}/markings',컨트롤러 연결));//내가 만든 경로의 마킹 불러오기 
//router.get('/api/routes/recommends', 컨트롤러연결)
