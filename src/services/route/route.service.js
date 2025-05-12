import axios from 'axios';
import { getDistance } from 'geolib';
import * as routeRepo from '../../repositories/route/route.repositories.js';
import { RouteCreatedDto } from '../../dtos/route/response/routeResponse.dto.js';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

//TravelMode 정의 
const TravelMode = {
  DRIVING: 'driving',
  WALKING: 'walking',
  BICYCLING: 'bicycling',
  TRANSIT: 'transit',
};

//사용자 요청으로 경로(Route)를 생성하는 함수
export const createRoute = async (dto, userId) => {
  const { routeName, description, places: placeInputs } = dto;

   // 1. 장소가 2개 이상 있어야 경로 생성 가능 (유효성 처리)
  if (!placeInputs || placeInputs.length < 2) {
    throw new Error('최소 2개의 장소가 필요합니다.');
  }

  // 2. 장소들을 sequence(순서)에 따라 정렬 
  const sortedPlaces = [...placeInputs].sort((a, b) => a.sequence - b.sequence);
  
  // 3. 출발지(start)와 도착지(end) 좌표 추출
  const start = { latitude: sortedPlaces[0].lat, longitude: sortedPlaces[0].lng };
  const end = { latitude: sortedPlaces[sortedPlaces.length - 1].lat, longitude: sortedPlaces[sortedPlaces.length - 1].lng };
 
  // 4. 출발지~도착지 직선 거리 계산 (m 단위)
  const distance = getDistance(start, end);

  // 5. 출발지와 도착지가 너무 가까운 경우 예외 처리
  if (distance < 10) {
    throw new Error('출발지와 도착지가 너무 가깝습니다. 최소 10m 이상 떨어져야 경로를 생성할 수 있습니다.');
  }

  // 6. Google Directions API 요청용 파라미터 구성
  const origin = `${start.latitude},${start.longitude}`; // 출발지 좌표
  const destination = `${end.latitude},${end.longitude}`; // 출발지 좌표
  const waypoints = sortedPlaces.slice(1, -1).map(p => `${p.lat},${p.lng}`); // 경유지들

  // walking 모드 선택 
  const mode = TravelMode.WALKING;

  // 7. Google Maps Directions API 요청 URL 구성  
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&region=kr&key=${GOOGLE_API_KEY}${waypoints.length ? `&waypoints=${encodeURIComponent(waypoints.join('|'))}` : ''}`;

  try {
    // 8. Directions API 요청 
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;
    console.log("✅ Google 응답 상태:", data.status);
    console.log("✅ 요청 mode:", mode);

    // 10. 경로가 없거나 오류 응답인 경우 예외 처리
    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      throw new Error(`경로를 찾을 수 없습니다. (Google status: ${data.status})\n요청 URL: ${url}`);
    }

    // 11. 각 경로 구간(leg)의 거리와 시간 합산
    const legs = data.routes[0].legs;
    const totalDistance = legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);

    // 12. DB에 route 저장 및 연결 장소 저장
    const savedRoute = await routeRepo.createRoute({ userId, name: routeName, description });
    await routeRepo.savePlaceRoutes(savedRoute.routeId, sortedPlaces);

     // 13. 응답용 DTO 생성 및 반환
    return new RouteCreatedDto({
      routeId: savedRoute.routeId,
      routeName,
      description,
      places: sortedPlaces,
      totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
      totalDuration: `${Math.round(totalDuration / 60)}분`,
    });
  } catch (err) {
    console.error("❌ Google Directions API 오류:", err.message);
    throw new Error('경로를 찾을 수 없습니다. 서버에서 지도 정보를 가져오지 못했습니다.');
  }
};
