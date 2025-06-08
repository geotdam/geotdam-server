import axios from 'axios';
import { searchPlacesFromTmap } from '../maps/place.service.js';
import { RouteResponseDto } from '../../dtos/route/response/routeResponse.dto.js';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import {
  NotExistsError,
  InvalidInputError,
  SampleError,
} from '../../utils/errors/errors.js';

const modes = ['WALK', 'BIKE', 'CAR'];
const modeToUrl = {
  WALK: 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json',
  //BIKE: 'https://apis.openapi.sk.com/tmap/routes/bicycle?version=1&format=json',
  CAR: 'https://apis.openapi.sk.com/tmap/routes?version=1&format=json',
};

const getFirstPlaceCoord = async (placeName) => {
  const places = await searchPlacesFromTmap(placeName);
  if (!places.length) {
    throw new NotExistsError(`장소명을 찾을 수 없습니다: ${placeName}`);
  }
  return {
    name: placeName,
    lat: places[0].lat,
    lng: places[0].lng,
  };
};

const getRouteByMode = async (mode, origin, destination, waypoints, nameSummary) => {
  const body = {
    startX: origin.lng,
    startY: origin.lat,
    endX: destination.lng,
    endY: destination.lat,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    startName: origin.name,
    endName: destination.name,
  };

  if (waypoints.length > 0) {
    body.passList = waypoints.map(wp => `${wp.lng},${wp.lat}`).join('_');
  }

  const url = modeToUrl[mode];

  try {
    const response = await axios.post(url, body, {
      headers: {
        appKey: TMAP_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[✅ ${mode}] Tmap 응답 수신 성공`);
    return new RouteResponseDto(response.data, nameSummary, mode);
  } catch (error) {
    console.warn(`[⚠️ ${mode}] 경로 생성 실패`, error.response?.data || error.message);
    return null; // 실패한 mode는 null로 처리
  }
};

export const getMultiModalRoutes = async (originName, destinationName, waypointNames = []) => {
  try {
    const origin = await getFirstPlaceCoord(originName);
    const destination = await getFirstPlaceCoord(destinationName);
    const waypoints = await Promise.all((waypointNames || []).map(getFirstPlaceCoord));

    if (origin.lat === destination.lat && origin.lng === destination.lng) {
      throw new InvalidInputError('출발지와 목적지가 동일할 수 없습니다.');
    }

    const nameSummary = [originName, ...waypointNames, destinationName].join(' → ');

    const routePromises = modes.map(mode =>
      getRouteByMode(mode, origin, destination, waypoints, nameSummary)
    );

    const allRoutes = (await Promise.all(routePromises)).filter(route => route !== null);

    if (allRoutes.length === 0) {
      throw new SampleError('Tmap에서 모든 경로를 생성할 수 없습니다.');
    }

    return {
      routes: allRoutes,
    };
  } catch (error) {
    throw error;
  }
};
