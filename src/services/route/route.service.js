import axios from 'axios';
import { searchPlacesFromTmap } from '../maps/place.service.js';
import { RouteResponseDto } from '../../dtos/route/response/routeResponse.dto.js';
import { TMAP_API_KEY, TMAP_TRANSIT_KEY } from '../../../config/tmap.config.js';
import {
  NotExistsError,
  InvalidInputError,
  SampleError,
} from '../../utils/errors/errors.js';

// 지원하는 모드
//const modes = ['WALK', 'CAR', 'TRANSIT'];
const modes = ['WALK', 'CAR'];

const modeToUrl = {
  WALK: 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json',
  CAR: 'https://apis.openapi.sk.com/tmap/routes?version=1&format=json',
 // TRANSIT: 'https://apis.openapi.sk.com/transit/routes',
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
  const url = modeToUrl[mode];
  let headers = {
    'Content-Type': 'application/json',
  };

  let body = {};

  if (mode === 'TRANSIT') {
    headers.appKey = TMAP_TRANSIT_KEY;
    body = {
      startX: origin.lng.toString(),
      startY: origin.lat.toString(),
      endX: destination.lng.toString(),
      endY: destination.lat.toString(),
      lang: 0,
      format: 'json',
      count: 1,
    };
  } else {
    headers.appKey = TMAP_API_KEY;
    body = {
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
  }

  try {
    const response = await axios.post(url, body, { headers });
    console.log(`[✅ ${mode}] Tmap 응답 수신 성공`);
    return new RouteResponseDto(response.data, nameSummary, mode);
  } catch (error) {
    console.warn(`[⚠️ ${mode}] 경로 생성 실패`, error.response?.data || error.message);
    return null; // 실패한 경우 무시
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
