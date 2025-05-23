import db from "../../models/index.js";

// 루트 키워드로 검색하기
export const findRoadByKeyword = async (keyword, offset = 0, limit = 6) => {
  return await db.Routes.findAndCountAll({
    where: {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
        { description: { [db.Sequelize.Op.like]: `%${keyword}%` } }
      ]
    },
    offset,
    limit,
  });
};
