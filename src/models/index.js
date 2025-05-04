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

// 모델 파일 순서 수동으로 지정
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

<<<<<<< HEAD
// 각 모델을 순차적으로 불러와서 db 객체에 추가
modelFiles.forEach((file) => {
  import(path.join(__dirname, 'database', file)).then((model) => {
    const modelInstance = model.default(sequelize, Sequelize.DataTypes);
    console.log(`Model loaded: ${file}`); 
    db[modelInstance.name] = modelInstance;
  });
});
=======
for (const file of modelFiles) {
  const model = await import(path.join(__dirname, 'database', file));  // 동적 import 사용
  db[model.default.name] = model.default(sequelize, Sequelize.DataTypes);  // 모델 초기화
}
>>>>>>> 209d3a7 (fix: sequlize instance 적용)

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
