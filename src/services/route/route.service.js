// src/services/route/route.service.js
import axios from 'axios';
import { searchPlacesFromTmap } from '../maps/place.service.js';
import { RouteResponseDto } from '../../dtos/route/response/routeResponse.dto.js';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import {
  NotExistsError,
  InvalidInputError,
  SampleError,
} from '../../utils/errors/errors.js';


const getFirstPlaceCoord = async (placeName) => {
  const places = await searchPlacesFromTmap(placeName);
  if (!places.length) {
    throw new NotExistsError(`장소명을 찾을 수 없습니다: ${placeName}`);
  }
  return {
    lat: places[0].lat,
    lng: places[0].lng,
  };
};//좌표값 찾는 함수 

export const getWalkingRouteByPlaceNames = async (originName, destinationName, waypointNames = []) => {
  try{
  console.log('[경로 검색 요청]');
  console.log('originName:', originName);
  console.log('destinationName:', destinationName);
  console.log('waypointNames:', waypointNames);
  
  
  const origin = await getFirstPlaceCoord(originName);
  const destination = await getFirstPlaceCoord(destinationName);
  const waypoints = await Promise.all((waypointNames || []).map(getFirstPlaceCoord));

  console.log('origin:', origin);
  console.log('destination:', destination);
  console.log('waypoints:', waypoints);

  if (origin.lat === destination.lat && origin.lng === destination.lng) {
      throw new InvalidInputError('출발지와 목적지가 동일할 수 없습니다.');
  }

  let passList = waypoints
    .map((wp) => `${wp.lng},${wp.lat}`)
    .join('_')
    .replace(/\s+/g, ''); // 공백 제거

  console.log('🛰️ passList:', JSON.stringify(passList));

  const body = {
    startX: origin.lng,
    startY: origin.lat,
    endX: destination.lng,
    endY: destination.lat,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    startName: originName,
    endName: destinationName,
  };

  if (passList.length > 0) {
    body.passList = passList;
  }

    console.log('Tmap 요청 body:', JSON.stringify(body, null, 2))

  const response = await axios.post(
    'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json',
    body,
    {
      headers: {
        appKey: TMAP_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const nameSummary = [originName, ...waypointNames, destinationName].join(' → ');
  return new RouteResponseDto(response.data, nameSummary);

}catch (error) {
    if (error.response?.status === 400) {
      throw new InvalidInputError('Tmap에서 경로를 생성할 수 없습니다. 경유지를 확인해주세요.', error.response?.data);
    }
    throw new SampleError('Tmap 요청 중 서버에러가 발생했습니다.', error.message);
  }
};
