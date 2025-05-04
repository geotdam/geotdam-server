import dotenv from "dotenv"; 
import express from "express";
import cors from "cors";
import db from './models/index.js';  // models/index.js에서 모델과 Sequelize 인스턴스를 가져옴
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // CORS 설정
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // JSON 형태로 요청 데이터 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 데이터 파싱

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 서버 실행 전에 모델을 로드한 후 동기화
async function loadModels() {
  const modelFiles = [
    'users.js',
    'socialLogins.js',
    'places.js',
    'routes.js',
    'reviews.js',
    'routeBookmarks.js',
    'routeImgs.js',
    'routeLikes.js',
    'userImgs.js',
  ];

  const modelPromises = modelFiles.map((file) =>
    import(path.join(__dirname, 'models/database', file))
      .then((model) => {
        const modelInstance = model.default(db.sequelize, db.Sequelize.DataTypes);
        console.log(`Model loaded: ${file}`);
        db[modelInstance.name] = modelInstance;
      })
      .catch((error) => {
        console.error(`Error loading model ${file}:`, error);
      })
  );

  await Promise.all(modelPromises);

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

// 모델을 로드한 후 데이터베이스 동기화 및 서버 실행
loadModels().then(() => {
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
});
