import express from 'express';
import { handleRouteLikeToggle } from '../../controllers/like/like.controller.js';
import { authenticateJWT } from '../../middlewares/authenticate.jwt.js';

const router = express.Router();

// 루트 좋아요 토글 API
router.post('/likes/:routeId', authenticateJWT, handleRouteLikeToggle);

export default router;
