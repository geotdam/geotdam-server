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
const basename = path.basename(__filename);
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

// 모델 정의: 동기적으로 모델 불러오기
const modelFiles = fs.readdirSync(path.join(__dirname, 'database'))
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

// 비동기 함수에서 모델을 로드하고 초기화
const loadModels = async () => {
  for (const file of modelFiles) {
    const model = await import(path.join(__dirname, 'database', file));  // 동적 import 사용
    db[model.default.name] = model.default(sequelize, Sequelize.DataTypes);  // 모델 초기화
  }

  // 모델 간 관계 설정: 모든 모델이 로딩된 후 관계를 설정
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // Sequelize 인스턴스와 등록된 모델 export
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // 모델 동기화
  await db.sequelize.sync({ force: false }); // 기존 테이블은 삭제하지 않고 동기화
  console.log('모델 동기화 완료');
};

// loadModels를 실행하고 그 결과가 끝난 후 동기화가 되도록 처리
loadModels().then(() => {
  console.log('모델 로딩 및 관계 설정 완료');
}).catch(err => {
  console.error('모델 로딩 실패:', err);
});

export default db;
