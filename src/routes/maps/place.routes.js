// src/routes/maps/place.routes.js
import express from 'express';
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import { searchPlaces } from '../../controllers/maps/place.controller.js';
import { createOrUpdateRating} from '../../controllers/maps/place.rating.controller.js';
import { createPlaceReview, getPlaceReviews} from '../../controllers/maps/place.review.controller.js';
import { searchPlacesDetail } from '../../controllers/maps/place.detail.controller.js';

const router = express.Router();
router.get('/places', searchPlaces); //장소검색 라우터 등록 
router.post('/places/:placeId/rates', authenticateJWT, createOrUpdateRating); //사용자 별점 등록 
router.post('/places/:tmapPlaceId/reviews', authenticateJWT, createPlaceReview); // 사용자 장소 리뷰 등록 
router.get('/places/:tmapPlaceId/reviews', getPlaceReviews); //장소 리뷰 페이징 
router.get('/places/:placeId', searchPlacesDetail); //장소 상세 검색 라우터 등록  

export default router;
