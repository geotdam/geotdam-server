import express from "express";
import { updateLocation, getBenchLocation} from './socket.controller.js';
import authenticateJWT from '../middlewares/authenticate.jwt.js';

const router = express.Router();

router.post("/location",authenticateJWT, updateLocation);
router.get("/location/benches",authenticateJWT, getBenchLocation); 

export default router;