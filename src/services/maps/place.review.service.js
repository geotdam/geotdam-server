
import {
  updateRatingAndReview,
  createRatingAndReview,
  findReviewByUserAndPlace
} from '../../repositories/maps/place.review.repository.js';
import { PlaceReviewResponseDto } from '../../dtos/maps/place.dto.js';
import { findReviewsWithPagination } from '../../repositories/maps/place.review.repository.js';

export const createOrUpdateReview = async ({ placeId, userId, content, rating }) => {

  const existing = await findReviewByUserAndPlace(userId, placeId);
  
 let result;
  if (existing) {
    await updateRatingAndReview(userId, placeId, rating, content);
    result = await findReviewByUserAndPlace(userId, placeId); // ✅ 다시 fetch
  } else {
    result = await createRatingAndReview(userId, placeId, rating, content);
  }

  return new PlaceReviewResponseDto(result);
};

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
