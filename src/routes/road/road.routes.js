// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import express from "express";
import { roadSearch } from "../../controllers/road/road.search.controller.js";
import { createShareLink } from "../../controllers/road/road.share.controller.js";
import { getRoadDetail } from "../../controllers/road/road.detail.controller.js";
import * as roadController from "../../controllers/road/road.controller.js";
import {
  getMyRoutes,
  getUserRoutes,
  getAllRoutes
} from "../../controllers/road/road.list.controller.js";

const router = express.Router();

// 나만의 루트 생성
router.post("/", authenticateJWT, roadController.newRoad);

// 루트 검색 페이징
router.get("/search", authenticateJWT, roadSearch);

// 내가 만든 루트 목록
router.get("/myroots", authenticateJWT, getMyRoutes);

// 특정 사용자 루트 목록
router.get("/users/:userId", getUserRoutes);

// 전체 루트 목록 (무한스크롤)
router.get("/", getAllRoutes);

// 루트 상세 조회
router.get("/:routeId", authenticateJWT, getRoadDetail);

// 루트 리뷰 생성
router.post("/:routeId/reviews", authenticateJWT, roadController.newReview);

// 루트 리뷰 조회 (페이징)
router.get("/:routeId/reviews", authenticateJWT, roadController.listReview);

// 루트 리뷰 수정
router.put("/reviews/:reviewId", authenticateJWT, roadController.updateReview);

//루트 sns 링크 생성
router.post("/:routeId/share", authenticateJWT, createShareLink);

export default router;
