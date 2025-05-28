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

// 루트 리뷰 수정
// 리뷰 하나 조회 -> 리뷰 존재하는지 확인, 본인 수정인지 확인 (1차적으로 확인하고~)
export const findById = async (reviewId) => {
  try {
    return await models.Reviews.findByPk(reviewId);
  } catch (error) {
    throw new Error(`리뷰 조회에 실패: ${error.message}`);
  }
};

export const updateReview = async ({ reviewId, comment, rates }) => {
  try {
    const updateFields = {};
    if (comment !== undefined) updateFields.comment = comment;
    if (rates !== undefined) updateFields.rates = rates;

    // 업데이트
    await models.Reviews.update(updateFields, {
      where: { reviewId: reviewId },
    });

    return await models.Reviews.findByPk(reviewId);
  } catch (error) {
    throw new Error(`리뷰 수정 실패: ${error.message}`);
  }
};
