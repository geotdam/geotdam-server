// 외부 API 및 이미지/평점 통합 처리
export const getPlaceDetailById = async (poiId) => {
  const detail = await getPlaceDetailFromTmap(poiId);
  return new PlaceResponseDto(detail);
};

export const getPlaceDetailFromTmap = async (poiId) => {
  try {
    const url = `https://apis.openapi.sk.com/tmap/pois/${poiId}`;
    const response = await axios.get(url, {
      headers: { appKey: TMAP_API_KEY },
      params: { version: 1, findOption: 'id', resCoordType: 'WGS84GEO' },
    });

    const poi = response.data.poiDetailInfo;
    if (!poi) throw new Error('POI 정보가 없습니다.');

    const thumbnail_url = await getPlaceImageUrl(poi.name);
    const { rating, participant } = await getGooglePlaceRating(poi.name);

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
    throw new Error('TMap에서 장소 상세 정보를 불러올 수 없습니다.');
  }
};
