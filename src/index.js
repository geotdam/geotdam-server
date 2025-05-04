import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";
import config from "../../config/config.cjs";
const environmentConfig = config[env];

const __filename = new URL(import.meta.url).pathname; 
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

// 모델 파일 순서대로 불러오기
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

modelFiles.forEach((file) => {
  import(path.join(__dirname, 'database', file)).then((model) => {
    const modelInstance = model.default(sequelize, Sequelize.DataTypes);
    console.log(`Model loaded: ${file}`);
    db[modelInstance.name] = modelInstance;
  }).catch((error) => {
    console.error(`Error loading model ${file}:`, error);
  });
});

// 모델 간 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize 인스턴스와 모델들을 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
