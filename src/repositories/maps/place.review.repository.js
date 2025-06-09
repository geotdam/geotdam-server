import db from "../../models/index.js";
const PlaceReviews = db.PlaceReviews;
const Users = db.Users;// 유저 정보 
const Places = db.Places;

// 리뷰 생성
export const createReview = async ({ placeId, userId, content, rating }) => {
  return await PlaceReviews.create({
    place_id: placeId,
    user_id: userId,
    content, //리뷰 내용 
    rating,
  });
};

// 리뷰 페이징 조회
export const findReviewsWithPagination = async (placeId, offset, limit) => {
  return await PlaceReviews.findAndCountAll({
    where: { place_id: placeId },
    include: [
  {
    model: Users,
    attributes: ['nickname'],
    include: [
      {
        model: db.UserImgs, 
        attributes: ['imageUrl'],
      },
    ],
  },
],
    order: [['created_at', 'DESC']],
    offset,
    limit,
  });
};

// 별점 리뷰 동시 업데이트
export const updateRatingAndReview = async (userId, placeId, rating, content) => {
  return await PlaceReviews.update(
    {
      rating,
      content,
      updatedAt: new Date()
    },
    {
      where: { user_id: userId, place_id: placeId }  
    }
  );
};

// 별점 리뷰 동시 생성하기 
export const createRatingAndReview = async (userId, placeId, rating, content) => {
  return await PlaceReviews.create({
    userId,
    placeId,
    rating,
    content
  });
};

// 리뷰를 user + place 기준으로 다시 fetch (최신 값)
export const findReviewByUserAndPlace = async (userId, placeId) => {
  return await PlaceReviews.findOne({
    where: { user_id: userId, place_id: placeId }
  });
};


// user_id + place_id 기준으로
export const findReviewWithUserByUserAndPlace = async (userId, placeId) => {
  return await PlaceReviews.findOne({
    where: {
      user_id: userId,
      place_id: placeId
    },
    include: [
      {
        model: Users,
        attributes: ['nickname'],
        include: [
          {
            model: db.UserImgs,
            attributes: ['imageUrl']
          }
        ]
      }
    ]
  });
};


// 사용자 리뷰 목록 조회 (관리자 계정 user_id = 1 제외)
export const findUserReviewsByPlace = async (placeId) => {
  return await PlaceReviews.findAll({
    where: {
      place_id: placeId,
      user_id: { [db.Sequelize.Op.ne]: 1 },
    },
  });
};


// corrected_rating 업데이트
export const updateCorrectedRatingInPlace = async (placeId, correctedRating) => {
  console.log("correctedRating:",correctedRating);
  const [affected] = await Places.update(
    { correctedRating: correctedRating },
    { where: { place_id: placeId } }
  );
  return affected;
};

// 외부 별점 정보 가져오기
export const getExternalRatingInfo = async (placeId) => {
  const place = await Places.findByPk(placeId);
  return {
  external_rating: place.externalRating,
  external_rating_participant: place.externalRatingParticipant,
};

};
