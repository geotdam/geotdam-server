import { getCctvMarkings, getStreetLampMarkings } from '../../services/marking/marking.service.js';
import { InvalidInputError } from '../../utils/errors/errors.js';
import { OkSuccess } from '../../utils/success/success.js';

export const MyRouteMarkings = async (req, res, next) => {
  try {
    const placeGu = req.query.placeGu;  
       if (!placeGu) {
      // placeGu가 없으면 400 에러 응답 처리 (선택사항)
      throw new InvalidInputError('placeGu query parameter is required.');
    }
    //console.log("요청받은 routeId:", routeId);
    // CCTV와 가로등 마킹 정보 가져오기
    const cctvResult = await getCctvMarkings(placeGu);

    const combinedMarkings = [...cctvResult];  //, ...lampResult

    // 마킹이 하나도 없으면 204 응답
    if (combinedMarkings.length === 0) {
      return res.status(204).json(new NoContentSuccess());
    }

    // 성공 응답: routeId 포함해서 리턴
    return res.status(200).json(
      new OkSuccess({
        markings: combinedMarkings
      })
    );

  } catch (error) {
    console.error('내 루트 주변 CCTV, 가로등 데이터를 찾을 수 없습니다.', error.message);
    next(error); 
  }
};
