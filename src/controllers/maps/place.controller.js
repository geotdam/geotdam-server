import { searchPlacesFromTmap } from '../../services/maps/place.service.js';
import { InvalidInputError } from '../../utils/errors/errors.js';
import { OkSuccess } from '../../utils/success/success.js';

export const searchPlaces = async (req, res, next) => {
  try {
    const query = req.query.query;

    if (!query) {
      throw new InvalidInputError('검색어(query)는 필수입니다.');
    }// 검색어 입력 안했을 때 에러 처리 

    const result = await searchPlacesFromTmap(query);

    // console.log('🔍 요청 query:', query); 로그 찍을 때 사용 

    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
    console.error('❌ [Tmap 장소 검색 실패]', error.message);
    next(error); 
  }
};
