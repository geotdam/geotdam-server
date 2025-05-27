import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getCctvMarkings = async (placeGu) => {
  try {
    const CCTVAPI_KEY = process.env.CCTV_KEY; // 환경변수에서 인증키 가져오기
    if (!CCTVAPI_KEY) throw new Error('CCTV API Key가 설정되어 있지 않습니다.');
    
    const serviceName = 'safeOpenCCTV';
    const type = 'xml';
    const startIndex = 1;
    const endIndex = 100; // 한번에 최대 1000건까지 가능, 예시로 100건 조회
    // 요청 URL
    const url = `http://openapi.seoul.go.kr:8088/${CCTVAPI_KEY}/${type}/${serviceName}/${startIndex}/${endIndex}/${placeGu}`;

    // GET 요청
    const response = await axios.get(url);

    // XML -> JS 객체 변환
    const result = await parseStringPromise(response.data);

    // 결과 코드 확인
    const code = result.safeOpenCCTV.RESULT[0].CODE[0];
    if (code !== 'INFO-000') {
      throw new Error(`API 요청 실패: ${result.safeOpenCCTV.RESULT[0].MESSAGE[0]}`);
    }

    // CCTV 위치 배열 추출
    const rows = result.safeOpenCCTV.row || [];

    // 마킹 배열 만들기
    const markings = rows.map((item) => ({
      markingType: 'CCTV',
      lat: parseFloat(item.WGSXPT[0]),
      lng: parseFloat(item.WGSYPT[0]),
      address: item.ADDR[0],
      area: item.SVCAREAID[0],
    }));

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