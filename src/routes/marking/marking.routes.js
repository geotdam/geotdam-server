// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import { MyRouteMarkings } from '../../controllers/marking/marking.controller.js';
import express from "express";
const router = express.Router();

// 내가 만든 특정 경로의 마킹 불러오기
router.get("/markings/cctv", authenticateJWT, MyRouteMarkings);


export default router;