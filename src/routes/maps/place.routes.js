// src/routes/maps/place.routes.js
import express from 'express';
import { searchPlaces } from '../../controllers/maps/place.controller.js';

const router = express.Router();
router.get('/places', searchPlaces); //장소검색 라우터 등록 

export default router;
