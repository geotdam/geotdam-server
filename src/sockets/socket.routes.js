import express from "express";
import { updateLocation, getBenchLocation, getNearbyBenchesByQuery} from './socket.controller.js';
import authenticateJWT from '../middlewares/authenticate.jwt.js';

const router = express.Router();

router.post("/location",authenticateJWT, updateLocation);
router.get("/location/benches",authenticateJWT, getBenchLocation); 
router.get("/locations/near/benches", authenticateJWT, getNearbyBenchesByQuery);

export default router;