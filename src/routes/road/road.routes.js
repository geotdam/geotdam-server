// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import express from "express";
import { roadSearch } from "../../controllers/road/road.search.controller.js";
import { createShareLink } from "../../controllers/road/road.share.controller.js";
import { getRoadDetail } from "../../controllers/road/road.detail.controller.js";
import * as roadController from "../../controllers/road/road.controller.js";
import { handleRecommendedRoutes } from '../../controllers/like/like.controller.js';
const router = express.Router();

// 나만의 루트 생성
router.post("/", authenticateJWT, roadController.newRoad);

// 루트 검색 페이징
router.get("/search", authenticateJWT, roadSearch);

// 좋아요 기준 추천 경로 조회
router.get('/recommends', authenticateJWT, handleRecommendedRoutes);

// 루트 상세 조회
router.get("/:routeId", authenticateJWT, getRoadDetail);

// 루트 리뷰 생성
router.post("/:routeId/reviews", authenticateJWT, roadController.newReview);

// 루트 리뷰 조회 (페이징)
router.get("/:routeId/reviews", authenticateJWT, roadController.listReview);

// 루트 리뷰 수정
router.put("/reviews/:reviewId", authenticateJWT, roadController.updateReview);

/**
 * 잘 못 생각해서.. 필요없는 라우터입니다..~
 *
 * // 루트에 별점 추가하기
 * router.post("/:routeId/rates", authenticateJWT, roadController.newRates);
 *
 * // 루트에 별점 추가했던 거 수정하기
 * router.put("/:routeId/rates", authenticateJWT, roadController.updateRates);
 */

//루트 sns 링크 생성
router.post("/:routeId/share", authenticateJWT, createShareLink);

export default router;
