import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import cron from "node-cron";
import db from "./models/index.js";
import authRoutes from "./routes/auth/auth.routes.js";
import SocialLoginService from "./services/socialLogin/socialLogin.service.js";
import placeRouter from "./routes/maps/place.routes.js";
import roadRoutes from "./routes/road/road.routes.js";
import { initGoogleRatingsIfNeeded } from "./init/initGoogleRatings.js"; // 상단에 import 추가

import { createServer } from "http";
import { Server } from "socket.io";
import locationSocket from "./sockets/locationSocket.js";
import path from "path";
import { fileURLToPath } from "url";
import routeRouter from "./routes/route/route.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import locationRouter from "./sockets/socket.routes.js";
import markingRouter from "./routes/marking/marking.routes.js";
import likeRouter from "./routes/likes/like.routes.js";
import bookmarkRouter from "./routes/bookmark/bookmark.routes.js";
import imageUploadRouter from "./routes/upload/image.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// __dirname 대체 (ESM용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Passport 설정
import "./config/passport.js";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRoutes); // auth 라우터 등록

app.use("/api/road", roadRoutes); // road 관련 라우터 등록

app.use("/api", bookmarkRouter); // 북마크 라우터 등록 
app.use("/api", placeRouter); // 장소검색 라우터 등록
app.use("/api", routeRouter); //경로검색 라우터 등록
app.use("/api", locationRouter);
app.use("/api", markingRouter);
app.use("/api", likeRouter);
app.use("/api", imageUploadRouter); // 이미지 업로드 



// 실시간 위치테스트용 기본 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//에러 핸들러
app.use(errorHandler);

// HTTP + Socket 서버 초기화
const server = createServer(app);
const io = new Server(server, {});

// 소켓 설정 등록
locationSocket(io);

// 데이터베이스 동기화 후 서버 실행
db.sequelize
  .sync({ force: false })
  .then(async() => {
    console.log("✅ Database synced successfully.");

    // 구글 더미 별점 초기화
    await initGoogleRatingsIfNeeded();

    const socialLoginService = new SocialLoginService();
    cron.schedule("0 3 * * *", async () => {
      console.log("[CRON]1년 미접속 유저 비활성화 시작");
      await socialLoginService.deactivateInactiveUsers();
    });
    console.log("비활성화 스케줄러가 등록되었습니다. (매일 03:00)");

    server.listen(port, () => {
      console.log(`✅ Server with Socket.io listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error syncing database:", error);
  });
