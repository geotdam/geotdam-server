import axios from 'axios';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import { PlaceResponseDto } from '../../dtos/maps/place.dto.js';
import { getPlaceImageUrl } from '../external/placeImage.service.js' //이미지 서비스 호출 
import { getGooglePlaceRating } from '../external/placeRating.service.js'; // 별점 서비스 호출 

// 검색 상세정보 요청 함수
export const getPlaceDetailFromTmap = async (poiId) => {
  const url = `https://apis.openapi.sk.com/tmap/pois/${poiId}`; // api 호출 

  const res = await axios.get(url, {
    headers: { appKey: TMAP_API_KEY },
    params: {
      version: 1,
      format: 'json',
    },
  });

  const poi = res.data.poiDetailInfo;
  const thumbnail_url = await getPlaceImageUrl(poi.name);//이미지 처리 구글 api로 
  const { rating, participant } = await getGooglePlaceRating(poi.name); // 별점이랑 별점 사용자 추가 

  return {
    name: poi.name,
    place_id: poi.id,
    location: `${poi.frontLat},${poi.frontLon}`,
    address: poi.fullAddress ?? "",

    tel: poi.tel ?? null,
    additionalInfo: poi.additionalInfo?.trim() || null, //빈문자열 체크해주기!  
    point: rating, //구글 api에서 갖고옴
    participant: participant, //구글 api에서 갖고옴

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
    thumbnail_url: thumbnail_url,
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

  // id 기준 중복 제거
  const uniquePoisMap = new Map();
  pois.forEach((poi) => {
    if (!uniquePoisMap.has(poi.id)) {
      uniquePoisMap.set(poi.id, poi);
    }
  });
  const uniquePois = Array.from(uniquePoisMap.values());

  // 각 장소에 대해 상세 정보 병렬 조회
  const detailedPlaces = await Promise.all(
    uniquePois.map((poi) => getPlaceDetailFromTmap(poi.id))
  );

  // DTO로 변환
  return detailedPlaces.map((place) => {
    const dto = new PlaceResponseDto(place);
    return dto;
  });
};

//좌표->구변환도 포함 
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