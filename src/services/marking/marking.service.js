import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getCctvMarkings = async (placeGu) => {
  try {
    const VWORLD_API_KEY = process.env.CCTV_KEY;
    if (!VWORLD_API_KEY) {
      return [];
    }

    // URL 파라미터 구성
    const queryParams = new URLSearchParams({
      service: 'data',
      request: 'GetFeature',
      data: 'LT_P_UTISCCTV',
      key: VWORLD_API_KEY,
      domain: process.env.VWORLD_DOMAIN || 'localhost:3000',
      format: 'json',
      size: '20',
      page: '1'
    });

    // 구 코드로 검색하거나 서울 전체 영역으로 검색
    if (placeGu) {
      // 구 이름으로 검색할 때는 geomFilter 사용
      queryParams.append('geomFilter', 'BOX(126.734086,37.413294,127.269311,37.715133)');
    } else {
      // 전체 검색시에는 서울시 동코드 범위로 검색 (11로 시작하는 코드가 서울시)
      queryParams.append('attrFilter', 'emdCd:LIKE:11*');
    }

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

    // 구 이름으로 필터링
    let filteredFeatures = features;
    if (placeGu) {
      const searchTerm = placeGu.endsWith('구') ? placeGu : placeGu + '구';
      filteredFeatures = features.filter(feature => 
        feature.properties.locate?.includes('서울특별시') && 
        feature.properties.locate?.includes(searchTerm)
      );
    }

    // 결과가 없는 경우 전체 결과 반환
    if (filteredFeatures.length === 0) {
      filteredFeatures = features;
    }

    // 최대 20개까지만 사용
    filteredFeatures = filteredFeatures.slice(0, 20);

    // point와 id 형식으로 변환
    const result = filteredFeatures.map(feature => ({
      point: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      },
      id: feature.id,
      type: 'CCTV',
      name: feature.properties.cctvname,
      address: feature.properties.locate
    }));

    console.log('변환된 결과:', result);
    return result;

  } catch (error) {
    console.error('getCctvMarkings 에러:', error.message);
    return [];
  }
};


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