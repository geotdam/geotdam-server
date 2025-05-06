import dotenv from "dotenv";
import express from "express";
import cors from "cors";
const { sequelize } = require('./models'); // 시퀄라이즈 연결
const routes = require('./database/routes'); // 라우터들

dotenv.config();

const app = express();
const port = process.env.PORT||3000;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use('/api', routes); // 모든 API 라우터 연결

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`✅ Example app listening on port ${port}`);
});

// DB 연결
sequelize.sync({ force: false })  // true로 하면 테이블 초기화됨 (주의)
  .then(() => {
    console.log('✅ DB connected');
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
  });