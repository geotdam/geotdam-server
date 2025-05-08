import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from './models/index.js'; 
import authRoutes from './routes/auth/auth.routes.js';
import { createServer } from "http";
import { Server } from "socket.io";
import locationSocket from './sockets/locationSocket.js';

dotenv.config();

const app = express();
const port = process.env.PORT||3000;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 소켓 설정 등록
locationSocket(io);

// 데이터베이스 동기화 후 서버 실행
db.sequelize.sync({ force: false })  // 기존 테이블은 삭제하지 않고 동기화
  .then(() => {
    console.log("✅ Database synced successfully.");
    app.listen(port, () => {
      console.log(`✅ Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error syncing database:", error);
  });
