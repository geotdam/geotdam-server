// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import express from "express";
import { roadSearch } from "../../controllers/road/road.search.controller.js";
import { createShareLink } from "../../controllers/road/road.share.controller.js";
import * as roadController from "../../controllers/road/road.controller.js";
const router = express.Router();

// 나만의 루트 생성 (일단 더미 데이터로 처리 -- 추후에 효림언니 여기서 수정하면 돼여~.~)
router.post("/", authenticateJWT, roadController.newRoad);

// 루트 리뷰 생성
router.post("/:routeId/reviews", authenticateJWT, roadController.newReview);

// 루트 리뷰 조회 (페이징)
router.get("/:routeId/reviews", authenticateJWT, roadController.listReview);

// 루트 검색 페이징 
router.get("/search",authenticateJWT, roadSearch);

//루트 sns 링크 생성 
router.post("/:routeId/share", authenticateJWT, createShareLink);

export default router;
