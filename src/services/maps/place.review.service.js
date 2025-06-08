
import {
  updateRatingAndReview,
  createRatingAndReview,
  findReviewByUserAndPlace,
   findReviewWithUserByUserAndPlace
} from '../../repositories/maps/place.review.repository.js';
import { PlaceReviewResponseDto } from '../../dtos/maps/place.dto.js';
import { findReviewsWithPagination } from '../../repositories/maps/place.review.repository.js';


export const createOrUpdateReview = async ({ placeId, userId, content, rating }) => {
  const existing = await findReviewByUserAndPlace(userId, placeId);

  if (existing) {
    await updateRatingAndReview(userId, placeId, rating, content);
  } else {
    await createRatingAndReview(userId, placeId, rating, content);
  }
  const reviewWithUser = await findReviewWithUserByUserAndPlace(userId, placeId);//유저 조회 
  return new PlaceReviewResponseDto(reviewWithUser);
};// 장소 리뷰 생성 (별점도 남길 수 있음)

export const getPaginatedReviews = async (placeId, page, limit) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await findReviewsWithPagination(placeId, offset, limit);

  return {
    totalCount: count, //몇개인지 
    currentPage: page,  // 현재 페이지 
    totalPages: Math.ceil(count / limit),
    reviews: rows.map(r => new PlaceReviewResponseDto(r)),
  };
};// 장소 리뷰 페이징 
