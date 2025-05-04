// src/models/index.js

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
      logging: false,
    }
  );

  const db = {};
  const modelFiles = fs
    .readdirSync(path.join(__dirname, "database"))
    .filter((file) => file.endsWith(".js"));

  for (const file of modelFiles) {
    const modelModule = await import(path.join(__dirname, "database", file));
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
