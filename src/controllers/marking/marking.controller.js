import { getCctvMarkings } from '../../services/marking/marking.service.js';
import { InvalidInputError } from '../../utils/errors/errors.js';
import { OkSuccess,NoContentSuccess } from '../../utils/success/success.js';
import { getNearbyStreetLamps } from '../../services/marking/osm.service.js';
import axios from 'axios';

//CCTV 데이터
export const MyRouteMarkings = async (req, res, next) => {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new InvalidInputError("유효한 위도(latitude)와 경도(longitude)를 입력하세요.");
    }

    // CCTV마킹 정보 가져오기 (1km 반경 내)
    const cctvResult = await getCctvMarkings(latitude, longitude, 1000);

    // 마킹이 하나도 없으면 204 응답
    if (cctvResult.length === 0) {
      return res.status(204).json(new NoContentSuccess());
    }

    // 성공 응답
    return res.status(200).json(
      new OkSuccess({
        markings: cctvResult
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
      throw new InvalidInputError("유효한 위도(latitude)와 경도(longitude)를 입력하세요.");
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

//위경도 받아서 구로 바꾸기

const getGuFromCoordinates = async (latitude, longitude) => {
  const url = 'https://apis.openapi.sk.com/tmap/geo/reversegeocoding';
  const params = {
    version: 1,
    lat: latitude,
    lon: longitude,
    coordType: 'WGS84GEO',
    addressType: 'A10'
  };

  const headers = {
    appKey: process.env.TMAP_API_KEY
  };

  const { data } = await axios.get(url, { params, headers });

  const gu = data?.addressInfo?.gu_gun;
  if (!gu) throw new Error("구 정보를 가져올 수 없습니다.");
  return gu;
};