import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cron from 'node-cron';
import db from './models/index.js'; 
import authRoutes from './routes/auth/auth.routes.js';
import { createServer } from "http";
import { Server } from "socket.io";
import locationSocket from './sockets/locationSocket.js';
import SocialLoginService from './services/socialLogin/socialLogin.service.js';
import path from "path";
import { fileURLToPath } from "url";
import placeRouter from './routes/maps/place.routes.js';
import routeRouter from './routes/route/route.routes.js'; 


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// __dirname 대체 (ESM용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRoutes); // auth 라우터 등록
app.use('/api', placeRouter); // 장소검색 라우터 등록
 app.use('/api', routeRouter);//경로검색 라우터 등록 

app.use("/api/auth", authRoutes);

// 실시간 위치테스트용 기본 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// HTTP + Socket 서버 초기화
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 소켓 설정 등록
locationSocket(io);

// 데이터베이스 동기화 후 서버 실행
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synced successfully.");

    const socialLoginService = new SocialLoginService();
    cron.schedule('0 3 * * *', async () => {
      console.log('[CRON] ⏰ 1년 미접속 유저 비활성화 시작');
      await socialLoginService.deactivateInactiveUsers();
    });
    console.log('✅ 비활성화 스케줄러가 등록되었습니다. (매일 03:00)');

    server.listen(port, () => {
      console.log(`✅ Server with Socket.io listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error syncing database:", error);
  });
