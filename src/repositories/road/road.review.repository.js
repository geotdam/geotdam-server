import models from "../../models/index.js"; // db.Reviews, db.Users, db.Routes 존재해야 함

export const createReview = async (reviewData) => {
  try {
    const createdReview = await models.Reviews.create({
      comment: reviewData.comment,
      rates: reviewData.rates,
      userId: reviewData.userId, // 반드시 포함
      routeId: reviewData.routeId, // 반드시 포함
    });

    return createdReview;
  } catch (error) {
    throw new Error(`리뷰 생성 실패: ${error.message}`);
  }
};

// 루트 리뷰 조회
export const findByRouteId = async ({ routeId, limit, offset }) => {
  try {
    const { rows, count } = await models.Reviews.findAndCountAll({
      where: { routeId },
      limit: Math.min(limit, 100), // 최대 100개 제한두기 (제한 두지 말까.. 일단..)
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { reviews: rows, count };
  } catch (error) {
    throw new Error(`리뷰 조회 실패: ${error.message}`);
  }
};
