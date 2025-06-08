//컨트롤러
import { createOrUpdateReview, getPaginatedReviews } from '../../services/maps/place.review.service.js';
import { OkSuccess } from '../../utils/success/success.js';

export const createPlaceReview = async (req, res, next) => {
  const { placeId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId;

  try {
    const result = await createOrUpdateReview({ placeId, userId, content, rating });
    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
    next(error); 
  }
}; // 리뷰 등록 컨트롤러 

export const getPlaceReviews = async (req, res , next) => {
  const { placeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const result= await getPaginatedReviews(placeId, page, limit);
    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
     next(error); 
  }
};//리뷰 페이징 컨트롤러 
