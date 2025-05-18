import express from 'express';
import { getWalkingRoute } from '../../controllers/route/route.controller.js';

const router = express.Router();

router.get('/maps', getWalkingRoute);

export default router; 
