import * as roadRepository from "../../repositories/road/road.repository.js";
import * as reviewRepository from "../../repositories/road/road.review.repository.js";
import RoadDto from "../../dtos/road/road.dto.js";
import ReviewDto from "../../dtos/road/road.review.dto.js";

// 나만의 루트 생성
export const newRoad = async ({
  // 로그인 한 해당 유저가 누구인지 미들웨어로 관리해야 합니당
  userId, // 미들웨어에서 추출하기~
  name,
  description,
  avgRates, // 평균 평점
}) => {
  const road = await roadRepository.create({
    userId,
    name,
    description,
    avgRates: avgRates || 0,
  });

  return new RoadDto(road);
};

// 루트 리뷰 생성
export const newReview = async ({ userId, routeId, comment, rates }) => {
  if (!userId || !routeId) throw new Error("필수 필드 누락");
  if (rates < 0 || rates > 5) throw new Error("평점 범위 오류(0~5)");

  const review = await reviewRepository.createReview({
    userId,
    routeId,
    comment,
    rates,
  });
  return new ReviewDto(review);
};

// 루트 리뷰 조회
export const getRoadReviews = async ({ routeId, limit = 10, offset = 0 }) => {
  // 파라미터 검증하기~
  if (!routeId) throw new Error("경로 ID 필수");
  if (limit < 0 || offset < 0) throw new Error("잘못된 페이지 번호");

  const { reviews, count } = await reviewRepository.findByRouteId({
    routeId,
    limit,
    offset,
  });

  // DTO 변환
  return {
    reviews: reviews.map((review) => new ReviewDto(review)),
    totalCount: count,
  };
};
