// src/routes/road.routes.js
import authenticateJWT from "../../middlewares/authenticate.jwt.js";
import { MyRouteMarkings,MyRouteStreetLight } from '../../controllers/marking/marking.controller.js';
import express from "express";
const router = express.Router();

// 특정구의 cctv 마킹 불러오기
router.get("/markings/cctv", authenticateJWT, MyRouteMarkings);

//위치별 가로등 불러오기
router.get("/markings/streetlight", authenticateJWT, MyRouteStreetLight);


export default router;