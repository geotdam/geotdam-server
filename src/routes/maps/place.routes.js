// src/routes/maps/place.routes.js
import express from 'express';
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import { searchPlaces } from '../../controllers/maps/place.controller.js';
import { createOrUpdateRating} from '../../controllers/maps/place.rating.controller.js';

const router = express.Router();
router.get('/places', searchPlaces); //장소검색 라우터 등록 
router.post('/places/:placeId/rates', authenticateJWT, createOrUpdateRating); //사용자 별점 등록 

export default router;
