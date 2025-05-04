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

export const initModels = async () => {
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

  const db = {};

  // 모델 파일을 동적으로 불러오기 전에 'Places' 모델을 먼저 불러옵니다.
  const modelFiles = fs
    .readdirSync(path.join(__dirname, "database"))
    .filter((file) => file.endsWith(".js"));

  // 각 모델을 동적으로 import하고 sequelize에 모델을 등록
  for (const file of modelFiles) {
    const modelModule = await import(path.join(__dirname, "database", file));
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  // 관계 설정 전에 'Places' 모델이 sequelize.models에 존재하는지 확인
  console.log("sequelize.models:", sequelize.models);

  // 모든 모델 간 관계 설정
  for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;  // db를 반환
};

// initModels를 호출하고 반환된 db를 export
const db = await initModels();  // 비동기 호출을 위해 top-level await 사용

export default db;  // 반환된 db를 export
