import axios from 'axios';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import { PlaceResponseDto } from '../../dtos/maps/place.dto.js';

// 상세정보 요청 함수
const getPlaceDetailFromTmap = async (poiId) => {
  const url = `https://apis.openapi.sk.com/tmap/pois/${poiId}`; // api 호출 

  const res = await axios.get(url, {
    headers: { appKey: TMAP_API_KEY },
    params: {
      version: 1,
      format: 'json',
    },
  });

  const poi = res.data.poiDetailInfo;

  return {
  name: poi.name,
  place_id: poi.id,
  location: `${poi.frontLat},${poi.frontLon}`,
  address: poi.fullAddress ?? "",

  tel: poi.tel ?? null,
  additionalInfo: poi.additionalInfo?.trim() || null, //빈문자열 체크해주기!  
  point: poi.point && poi.point !== '' ? Number(poi.point) : 0,
  participant: poi.participant && poi.participant !== '' ? Number(poi.participant) : 0,
  
  jibunAddress: poi.newAddress ?? null,
  roadAddress: poi.roadName ?? null,
  bizCategory: poi.bizCatName ?? null,
  menuInfo: poi.menuInfo ?? null,
  franchise: poi.franchiseYn === 'Y',
  facilities: {
    parking: poi.parkFlag === 'Y',
    chargingStation: poi.evChargers ?? [],
    toilet: poi.toiletFlag === 'Y',
  },
};

};

//장소 검색 후 상세정보 포함 반환
export const searchPlacesFromTmap = async (query) => {
  const res = await axios.get('https://apis.openapi.sk.com/tmap/pois', {
    headers: { appKey: TMAP_API_KEY },
    params: {
      version: 1,
      format: 'json',
      searchKeyword: query,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      count: 5,
    },
  });

  const pois = res.data?.searchPoiInfo?.pois?.poi || [];

  // 각 장소에 대해 상세 정보 병렬 조회
  const detailedPlaces = await Promise.all(
    pois.map((poi) => getPlaceDetailFromTmap(poi.id))
  );

  // DTO로 변환
  return detailedPlaces.map((place) => new PlaceResponseDto(place));
};


//좌표->구변환
export const getGuFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://apis.openapi.sk.com/tmap/geo/reversegeocoding', {
      params: {
        version: 1,
        lat,
        lon: lng,
        coordType: 'WGS84GEO',
        addressType: 'A10'
      },
      headers: {
        appKey: TMAP_API_KEY
      }
    });

    const fullAddress = response.data.addressInfo;
    return fullAddress.gu; // 강남구, 송파구 등
  } catch (error) {
    console.error('역지오코딩 실패:', error.message);
    throw error;
  }
};