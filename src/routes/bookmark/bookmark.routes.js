import express from 'express';
import { handleRouteBookmarkToggle } from '../../controllers/bookmark/bookmark.controller.js';
import { authenticateJWT } from '../../middlewares/authenticate.jwt.js';

const router = express.Router();

// 루트 북마크 토글 API
router.post('/mypages/bookmarks/:routeId', authenticateJWT, handleRouteBookmarkToggle);

export default router;
