import express from "express";
import {
  handleRouteBookmarkToggle,
  handleGetUserBookmarks,
} from "../../controllers/bookmark/bookmark.controller.js";
import * as bookmarkController from "../../controllers/bookmark/place.bookmark.controller.js";
import { authenticateJWT } from "../../middlewares/authenticate.jwt.js";

const router = express.Router();

// 장소 북마크 API
router.post(
  "/places/:tmapPlaceId/bookmark",
  authenticateJWT,
  bookmarkController.placeBookmark
);

// 루트 북마크 토글 API
router.post(
  "/mypages/bookmarks/:routeId",
  authenticateJWT,
  handleRouteBookmarkToggle
);

// 커서 기반 북마크 목록 조회
router.get("/mypages/bookmarks", authenticateJWT, handleGetUserBookmarks);

// 장소 북마크 조회
router.get(
  "/places/bookmark",
  authenticateJWT,
  bookmarkController.getPlaceBookmarks
);

export default router;
