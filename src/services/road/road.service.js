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
  const review = await reviewRepository.create({
    userId,
    routeId,
    comment,
    rates,
  });
  return new ReviewDto(review);
};

// 루트 리뷰 조회
// export const getRoadReviews = async ({
//   reviewId,
//   routeId,
//   limit = 10,
//   offset = 0,
// }) => {
//   // 리뷰 목록 및 전체 개수 조회
//   const { review, count } = await reviewRepository.findByRouteId({
//     roadId,
//     limit,
//     offset,
//   });
// };
