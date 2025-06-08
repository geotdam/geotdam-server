import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();

const env = process.env.NODE_ENV || "development";
import config from "../../config/config.cjs";
const environmentConfig = config[env];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
  environmentConfig.database,
  environmentConfig.username,
  environmentConfig.password,
  {
    host: environmentConfig.host,
    dialect: environmentConfig.dialect,
    port: environmentConfig.port,
    timezone: environmentConfig.timezone,
    logging: false, //로그 출력 안되게 바꿈 (너무 길어서서)
  }
);

// 모델 파일 순서 지정
const modelFiles = [
  "users.js",
  "socialLogins.js",
  "places.js",
  "placeImgs.js",
  "placeRoutes.js",
  "routes.js",
  "reviews.js",
  "routeBookmarks.js",
  "routeImgs.js",
  "routeLikes.js",
  "userImgs.js",
  "jwtToken.js",
  "placeReviews.js",
  "placeBookmarks.js",
];

const db = {};

// 비동기 초기화 수행
for (const file of modelFiles) {
  const modelPath = pathToFileURL(path.join(__dirname, "database", file)).href;
  const modelModule = await import(modelPath);
  const modelInstance = modelModule.default(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
  console.log(`✅ Model loaded: ${file}`);
}

// 모든 모델 로드된 뒤 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize와 함께 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
