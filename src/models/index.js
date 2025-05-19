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
const db = {};

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  environmentConfig.database,
  environmentConfig.username,
  environmentConfig.password,
  {
    host: environmentConfig.host,
    dialect: environmentConfig.dialect,
    port: environmentConfig.port,
    timezone: environmentConfig.timezone,
    logging: console.log,
  }
);

// 모델 파일 순서 수동으로 지정
const modelFiles = [
  "users.js",
  "socialLogins.js",
  "places.js",
  "placeImgs.js",       // ✅ 추가
  "placeRoutes.js",     // ✅ 추가
  "routes.js",
  "reviews.js",
  "routeBookmarks.js",
  "routeImgs.js",
  "routeLikes.js",
  "userImgs.js",
  "jwtToken.js",
  'placeRoutes.js'
];

// 각 모델을 순차적으로 불러와서 db 객체에 추가
modelFiles.forEach((file) => {
  const modelPath = pathToFileURL(path.join(__dirname, "database", file)).href;

  import(modelPath).then((model) => {
    const modelInstance = model.default(sequelize, Sequelize.DataTypes);
    console.log(`Model loaded: ${file}`);
    db[modelInstance.name] = modelInstance;
  });
});

// 모델 간 관계 설정 (모든 모델이 로드된 후에 설정)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize 인스턴스와 등록된 모델 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
