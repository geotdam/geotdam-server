//컨트롤러
import { createOrUpdateReview, getPaginatedReviews } from '../../services/maps/place.review.service.js';

export const createPlaceReview = async (req, res) => {
  const { placeId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId;

  try {
    const review = await createOrUpdateReview({ placeId, userId, content, rating });
    return res.status(201).json({ message: '리뷰가 등록되었습니다.', review });
  } catch (error) {
    return res.status(500).json({ message: '리뷰 등록에 실패했습니다.', error: error.message });
  }
};

export const getPlaceReviews = async (req, res) => {
  const { placeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const reviews = await getPaginatedReviews(placeId, page, limit);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: '리뷰 조회에 실패했습니다.', error: error.message });
  }
};
