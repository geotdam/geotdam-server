import models from "../../models/index.js";

// 루트 리뷰 생성
export const create = async (reviewData) => {
  try {
    const createdReview = await models.Review.create({
      userId: reviewData.userId,
      routeId: reviewData.routeId,
      comment: reviewData.comment,
      rates: reviewData.rates,
    });

    return await models.Review.findByPk(createdReview.id, {
      include: [
        { model: models.User, attributes: ["userId", "nickname"] }, // 유저 정보로 찾기..
        { model: models.Route, attributes: ["routeId", "title"] }, // 경로 기본 정보
      ],
    });
  } catch (error) {
    throw new Error(`리뷰 생성 실패: ${error.message}`);
  }
};
