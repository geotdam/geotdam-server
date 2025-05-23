import db from "../../models/index.js"


//루트 키워드로 검색하기 (아직 안은 작성 안함)

export const findRoadByKeyword = async (keyword, offset = 0, limit = 6) => {//페이징 6개씩 짜른다 
  return await db.Routes.findAndCountAll({
    where: {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
        { description: { [db.Sequelize.Op.like]: `%${keyword}%` } }
      ]
    },
    offset,
    limit
  });
};