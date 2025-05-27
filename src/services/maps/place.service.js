// src/services/maps/place.service.js
import axios from 'axios';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import { PlaceResponseDto } from '../../dtos/maps/place.dto.js';

export const searchPlacesFromTmap = async (query) => {
  const res = await axios.get('https://apis.openapi.sk.com/tmap/pois', {//tmap api 담아오기
    headers: {
      appKey: TMAP_API_KEY,
    },
    params: {
      version: 1,
      format: 'json',
      searchKeyword: query,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      count: 5,
    },
  });

  const pois = res.data.searchPoiInfo?.pois?.poi || [];
  //console.log('📦 Tmap 응답:', JSON.stringify(res.data, null, 2)); 

  // 여기서 DTO로 가공
  return pois.map((poi) =>
    new PlaceResponseDto({
      name: poi.name,
      place_id: poi.id,
      location: `${poi.frontLat},${poi.frontLon}`, // 위도,경도 문자열
      address: `${poi.upperAddrName ?? ''} ${poi.middleAddrName ?? ''} ${poi.roadName ?? ''} ${poi.firstBuildNo ?? ''}`.trim(),
    })
  );
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