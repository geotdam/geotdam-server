import express from 'express';
import { getRoute } from '../../controllers/route/route.controller.js';

const router = express.Router();


router.get('/maps', getRoute);

export default router; 
