
📄 예시 사용법

const db = require('../models');
const { users, routes } = db;

const data = await users.findAll({ include: [routes] });
