import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cron from 'node-cron';
import db from './models/index.js'; 
import authRoutes from './routes/auth/auth.routes.js';
import SocialLoginService from './services/socialLogin/socialLogin.service.js';
import placeRouter from './routes/maps/place.routes.js';
import routeRouter from './routes/route/route.routes.js'; 


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use("/api/auth", authRoutes); // auth 라우터 등록
app.use('/api', placeRouter); // 장소검색 라우터 등록
 app.use('/api', routeRouter);//경로검색 라우터 등록 

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 데이터베이스 동기화 후 서버 실행
db.sequelize
  .sync({ force: false }) // 기존 테이블은 삭제하지 않고 동기화
  .then(() => {
    console.log("✅ Database synced successfully.");

    const socialLoginService = new SocialLoginService();
    cron.schedule('0 3 * * *', async () => {
      console.log('[CRON] ⏰ 1년 미접속 유저 비활성화 시작');
      await socialLoginService.deactivateInactiveUsers();
    });
    console.log('✅ 비활성화 스케줄러가 등록되었습니다. (매일 03:00)');

    app.listen(port, () => {
      console.log(`✅ Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error syncing database:", error);
  });
