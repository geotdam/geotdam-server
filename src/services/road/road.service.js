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

// 루트 리뷰 수정
export const updateReview = async ({ reviewId, userId, comment, rates }) => {
  // 디버깅용 콘솔 로그
  // console.log("reviewId: " + reviewId);
  // console.log("userId: " + userId);

  if (!reviewId || !userId) throw new Error("필수 필드가 누락되었습니다.");
  if (rates !== undefined && (rates < 0 || rates > 5))
    throw new Error("평점은 0~5점까지 가능합니다.");

  // 리뷰 존재하는지 확인, 본인 수정인지 확인
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new Error("리뷰가 존재하지 않습니다.");
  if (review.userId !== userId) throw new Error("본인만 수정할 수 있습니다.");

  // 수정
  const update = await reviewRepository.updateReview({
    reviewId,
    comment,
    rates,
  });

  return new ReviewDto(update);
};
