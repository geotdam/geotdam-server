// src/services/maps/place.review.service.js
import {
  updateRatingAndReview,
  createRatingAndReview,
  findReviewByUserAndPlace,
  findReviewWithUserByUserAndPlace,
  findReviewsWithPagination,
  findUserReviewsByPlace,
  getExternalRatingInfo,
  updateCorrectedRatingInPlace
} from '../../repositories/maps/place.review.repository.js';

import { PlaceReviewResponseDto } from '../../dtos/maps/place.dto.js';

// 사용자 리뷰 생성 또는 수정
export const createOrUpdateReview = async ({ placeId, userId, content, rating }) => {
  const existing = await findReviewByUserAndPlace(userId, placeId);

  if (existing) {
    await updateRatingAndReview(userId, placeId, rating, content);
  } else {
    await createRatingAndReview(userId, placeId, rating, content);
  }

  // 사용자 리뷰 작성 후 보정 별점 업데이트
  await updateCorrectedRating(placeId);

  const reviewWithUser = await findReviewWithUserByUserAndPlace(userId, placeId);
  return new PlaceReviewResponseDto(reviewWithUser);
};

// 장소 리뷰 페이징 조회
export const getPaginatedReviews = async (placeId, page, limit) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await findReviewsWithPagination(placeId, offset, limit);

  return {
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    reviews: rows.map(r => new PlaceReviewResponseDto(r)),
  };
};

// 보정된 별점(corrected_rating) 계산 후 저장
export const updateCorrectedRating = async (placeId) => {
  const placeRatingInfo = await getExternalRatingInfo(placeId);
  if (!placeRatingInfo) return;

  const { external_rating, external_rating_participant } = placeRatingInfo;

  const userReviews = await findUserReviewsByPlace(placeId); // user_id ≠ 1 포함된 함수여야 함
  const userSum = userReviews.reduce((sum, r) => sum + r.rating, 0);
  const userCount = userReviews.length;

  const totalSum = external_rating * external_rating_participant + userSum;
  const totalCount = external_rating_participant + userCount;

  const corrected = totalCount > 0 ? totalSum / totalCount : 0;
  const roundedCorrected = Math.round(corrected * 10) / 10; // 소수점 둘째자리 반올림
  
  //로그 추가
  console.log(`- 구글 별점: ${external_rating} (${external_rating_participant}명)`);
  console.log(`- 유저 리뷰 총합: ${userSum} (${userCount}명)`);
  console.log(`- 최종 corrected_rating: ${roundedCorrected}`);
  await updateCorrectedRatingInPlace(placeId, roundedCorrected);
};