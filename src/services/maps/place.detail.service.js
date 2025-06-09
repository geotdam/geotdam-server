import axios from 'axios';
import { TMAP_API_KEY } from '../../../config/tmap.config.js';
import { PlaceResponseDto } from '../../dtos/maps/place.dto.js'; 
import { getPlaceImageUrl } from '../external/placeImage.service.js' //이미지 서비스 호출 
import { getGooglePlaceRating } from '../external/placeRating.service.js'; // 별점 서비스 

export const getPlaceDetailById = async (placeId) => {
  const detail = await getPlaceDetailFromTmap(placeId);
  return new PlaceResponseDto(detail);
};

export const getPlaceDetailFromTmap = async (placeId) => {
  try {
    const url = `https://apis.openapi.sk.com/tmap/pois/${placeId}`;
    const response = await axios.get(url, {
      headers: { appKey: TMAP_API_KEY },
      params: { version: 1, findOption: 'id', resCoordType: 'WGS84GEO' },
    });

    const poi = response.data.poiDetailInfo;
    if (!poi) throw new Error('POI 정보가 없습니다.'); 

    const thumbnail_url = await getPlaceImageUrl(poi.name);//이미지 처리 구글 api로 
    const { rating, participant } = await getGooglePlaceRating(poi.name); // 별점이랑 별점 사용자 추가 

    return {
      name: poi.name,
      place_id: poi.id,
      location: `${poi.frontLat},${poi.frontLon}`,
      address: poi.fullAddress ?? "",
      tel: poi.tel ?? null,
      additionalInfo: poi.additionalInfo?.trim() || null,
      point: rating,
      participant: participant,
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
      thumbnail_url,
    };
  } catch (error) {
  console.error("TMap API 호출 실패:", error.response?.data || error.message);
  throw new Error('TMap에서 장소 상세 정보를 불러올 수 없습니다.');
}
};
