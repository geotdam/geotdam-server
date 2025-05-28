// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import express from "express";
import { roadSearch } from "../../controllers/road/road.search.controller.js";
import * as roadController from "../../controllers/road/road.controller.js";
const router = express.Router();

// 나만의 루트 생성
router.post("/", authenticateJWT, roadController.newRoad);

// 루트 리뷰 생성
router.post("/:routeId/reviews", authenticateJWT, roadController.newReview);

// 루트 리뷰 조회 (페이징)
router.get("/:routeId/reviews", authenticateJWT, roadController.listReview);

// 루트 검색 페이징 
router.get("/search",roadSearch);


export default router;
