import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getCctvMarkings = async (latitude, longitude, radius = 1000) => {
  try {
    const VWORLD_API_KEY = process.env.CCTV_KEY;
    if (!VWORLD_API_KEY) {
      return [];
    }

    // Convert radius from meters to degrees (approximate)
    const degreeRadius = radius / 111000; // 1 degree ≈ 111km at the equator

    // Calculate bounding box coordinates
    const minLng = longitude - degreeRadius;
    const minLat = latitude - degreeRadius;
    const maxLng = longitude + degreeRadius;
    const maxLat = latitude + degreeRadius;

    // URL 파라미터 구성
    const queryParams = new URLSearchParams({
      service: 'data',
      request: 'GetFeature',
      data: 'LT_P_UTISCCTV',
      key: VWORLD_API_KEY,
      domain: process.env.VWORLD_DOMAIN || 'localhost:3000',
      format: 'json',
      size: '20',
      page: '1',
      geomFilter: `BOX(${minLng},${minLat},${maxLng},${maxLat})`
    });

    const url = `https://api.vworld.kr/req/data?${queryParams.toString()}`;
    
    console.log('API 요청 URL:', url);

    const response = await axios.get(url);
    
    console.log('API 응답:', JSON.stringify(response.data, null, 2));

    // 응답 상태 처리
    if (!response.data?.response || response.data.response.status === 'ERROR') {
      console.log('API 에러:', response.data?.response?.error);
      return [];
    }

    // 결과가 없는 경우
    const features = response.data.response?.result?.featureCollection?.features;
    if (!features || features.length === 0) {
      console.log('검색 결과가 없습니다.');
      return [];
    }

    // 최대 20개까지만 사용
    const limitedFeatures = features.slice(0, 20);

    // 각 CCTV와 주어진 좌표 사이의 거리를 계산하고 정렬
    const resultsWithDistance = limitedFeatures.map(feature => {
      const cctvLat = feature.geometry.coordinates[1];
      const cctvLng = feature.geometry.coordinates[0];
      
      // Calculate distance using Haversine formula
      const R = 6371000; // Earth's radius in meters
      const dLat = toRad(cctvLat - latitude);
      const dLon = toRad(cctvLng - longitude);
      const lat1 = toRad(latitude);
      const lat2 = toRad(cctvLat);

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return {
        point: {
          lat: cctvLat,
          lng: cctvLng
        },
        id: feature.id,
        type: 'CCTV',
        name: feature.properties.cctvname,
        address: feature.properties.locate,
        distance: distance // Distance in meters
      };
    });

    // Sort by distance
    resultsWithDistance.sort((a, b) => a.distance - b.distance);

    console.log('변환된 결과:', resultsWithDistance);
    return resultsWithDistance;

  } catch (error) {
    console.error('getCctvMarkings 에러:', error.message);
    return [];
  }
};

// Helper function to convert degrees to radians
function toRad(degrees) {
  return degrees * Math.PI / 180;
}

//가로등 마킹 불러오기
export const getStreetLampMarkings = async (latitude, longitude, radius = 3000) => {
  const query = `[out:json];node["amenity"="bench"](around:${radius},${latitude},${longitude});out;`;
  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await axios.get(url, {
      params: { data: query },
    });
    return response.data.elements; // 벤치 목록
  } catch (error) {
    console.error('Overpass API 요청 오류:', error.message);
    throw error;
  }
};