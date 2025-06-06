import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getCctvMarkings = async (placeGu) => {
  try {
    const VWORLD_API_KEY = process.env.CCTV_KEY;
    if (!VWORLD_API_KEY) throw new Error('V-World API Key가 설정되어 있지 않습니다.');

    // URL 파라미터 구성
    const queryParams = new URLSearchParams({
      service: 'data',
      request: 'GetFeature',
      data: 'LT_P_UTISCCTV',
      key: VWORLD_API_KEY,
      domain: process.env.VWORLD_DOMAIN || 'localhost:3000',
      format: 'json',
      size: '20', // 한 번에 가져올 데이터 수를 20개로 제한
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
    if (response.data.response?.status === 'ERROR') {
      throw new Error(`API 요청 실패: ${response.data.response.error?.text || '알 수 없는 오류'}`);
    }

    // 결과가 없는 경우
    if (response.data.response?.status === 'NOT_FOUND' || !response.data.response?.result?.featureCollection?.features) {
      console.log('검색 결과가 없습니다.');
      return [];
    }

    const features = response.data.response.result.featureCollection.features;
    
    // 구 이름으로 필터링
    let filteredFeatures = features;
    if (placeGu) {
      const searchTerm = placeGu.endsWith('구') ? placeGu : placeGu + '구';
      filteredFeatures = features.filter(feature => 
        feature.properties.locate?.includes(searchTerm)
      );
    }

    // 최대 20개까지만 사용 (이중 안전장치)
    filteredFeatures = filteredFeatures.slice(0, 20);

    // 마킹 배열 만들기
    const markings = filteredFeatures.map((feature, index) => {
      const coordinates = feature.geometry.coordinates;
      return {
        id: index + 1,
        markingType: 'CCTV',
        lat: coordinates[1],
        lng: coordinates[0],
        address: feature.properties.locate || '',
        cctvName: feature.properties.cctvname || '',
        area: feature.properties.emdCd || '',
      };
    });

    console.log(`총 ${markings.length}개의 CCTV를 찾았습니다.`);
    if (markings.length > 0) {
      console.log('첫 번째 CCTV 데이터 샘플:', markings[0]);
    }
    return markings;
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