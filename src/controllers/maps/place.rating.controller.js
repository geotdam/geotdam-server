//컨트롤러
import { createOrUpdateRatingService } from '../../services/maps/place.rating.service.js'
import { OkSuccess } from '../../utils/success/success.js';

export const createOrUpdateRating = async (req, res,next) => { //별점 등록 
  try {
    const { placeId } = req.params; // 파라미터에서 플레이스 아이디 가졍
    const { rating } = req.body;
    const userId = req.user.userId;

    const placeDto = await createOrUpdateRatingService({ userId, placeId, rating });
    return res.status(200).json(new OkSuccess(placeDto));
  } catch (error) {
    next(error); 
  }
};

