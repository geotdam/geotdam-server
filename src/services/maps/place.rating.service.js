//서비스
import {
  findByUserAndPlace,
  createRating,
  updateRating,
  findPlaceById,
} from '../../repositories/maps/place.rating.repository.js';
import { PlaceRatingResponseDto } from '../../dtos/maps/place.dto.js';

export const createOrUpdateRatingService = async ({ userId, placeId, rating }) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('별점은 1~5 사이여야 합니다.');
  }

  const existing = await findByUserAndPlace(userId, placeId); // 유저와 장소 확인

  if (existing) {
    // 존재하면 별점 업데이트
    await updateRating(userId, placeId, rating);
  } else {
    // 없으면 새로 생성
    await createRating(userId, placeId, rating);
  }
    //별점 등록 이후 해당 장소 정보 조회 후 DTO 생성
  const place = await findPlaceById(placeId);
  //console.log('조회된 place:', place);
  return new PlaceRatingResponseDto(place);
};
