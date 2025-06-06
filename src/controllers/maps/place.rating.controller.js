//컨트롤러
import { createOrUpdateRatingService } from '../../services/maps/place.rating.service.js'


export const createOrUpdateRating = async (req, res,next) => { //별점 등록 
  try {
    const { placeId } = req.params; // 파라미터에서 플레이스 아이디 가졍
    const { rating } = req.body;
    const userId = req.user.userId;

    const placeDto = await createOrUpdateRatingService({ userId, placeId, rating });

     res.status(200).json({
      isSuccess: true,
      code: 'COMMON200',
      message: '별점이 등록되었습니다.',
      result: placeDto, //등록된 장소 정보 포함시킴
    });
  } catch (error) {
    next(error); 
  }
};

