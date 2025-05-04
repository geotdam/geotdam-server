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

// ✅ Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  environmentConfig.database,  // 환경별 DB 설정 사용
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

// ✅ models/database 폴더 내 .js 모델 파일 모두 불러오기
const modelFiles = fs.readdirSync(path.join(__dirname, 'database'))
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

for (const file of modelFiles) {
  const model = await import(path.join(__dirname, 'database', file));  // 동적 import 사용
  db[model.default.name] = model.default(sequelize, Sequelize.DataTypes);  // 모델 초기화
}

// ✅ 모델 간 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Sequelize 인스턴스와 등록된 모델 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;  
