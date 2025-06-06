// 레포지토리
import db from "../../models/index.js";
const PlaceReviews = db.PlaceReviews;
const Places = db.Places;

// 해당 유저가 해당 장소에 작성한 리뷰가 있는지 확인
export const findByUserAndPlace = async (userId, placeId) => {
  return await PlaceReviews.findOne({
    where: {
      userId,   
      placeId,  
    },
  });
};

// 새로운 별점 생성
export const createRating = async (userId, placeId, rating) => {
  return await PlaceReviews.create({
    userId,     
    placeId,  
    rating,
    content: null, // 최초엔 리뷰 없이 별점만
  });
};

// 기존 별점 수정 (리뷰 없이)
export const updateRating = async (userId, placeId, rating) => {
  return await PlaceReviews.update(
    {
      rating,
      updatedAt: new Date(), 
    },
    {
      where: {
        userId,   
        placeId,  
      },
    }
  );
};

// 별점 + 장소 join해서 조회
export const findPlaceById = async (placeId) => {
  return await Places.findByPk(placeId);
};
