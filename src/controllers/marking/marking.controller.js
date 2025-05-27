import { getCctvMarkings } from '../../services/marking/marking.service.js';
import { InvalidInputError } from '../../utils/errors/errors.js';
import { OkSuccess } from '../../utils/success/success.js';
import { getNearbyStreetLamps } from '../../services/marking/osm.service.js';

//CCTV 데이터
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
    console.error('내 루트 주변 CCTV 데이터를 찾을 수 없습니다.', error.message);
    next(error); 
  }
};

//가로등 데이터
export const MyRouteStreetLight = async (req, res, next) => {
  try {

      const latitude = parseFloat(req.query.latitude);
      const longitude = parseFloat(req.query.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("유효한 위도(latitude)와 경도(longitude)를 입력하세요.");
      }


    const lamps = await getNearbyStreetLamps(latitude, longitude, 3000); // 반경 3km

    return res.status(200).json({
      isSuccess: true,
      code: "COMMON200",
      message: "성공입니다.",
      result: {
        lamps,
      },
    });
  } catch (error) {
    next(error);
  }
};
