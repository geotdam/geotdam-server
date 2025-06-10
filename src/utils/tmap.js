import axios from "axios";

export const getTmapPlaceInfo = async (tmapId) => {
  try {
    const response = await axios.get(
      `https://apis.openapi.sk.com/tmap/pois/${tmapId}`,
      { headers: { appKey: process.env.TMAP_API_KEY } }
    );

    const info = response.data.poiDetailInfo;
    if (!info) throw new Error("Tmap API 응답에 poiDetailInfo가 없습니다.");

    return {
      tmapPlaceId: tmapId,
      name: info.name,
      address: info.address || info.bldAddr || "",
      frontLon: info.frontLon,
      frontLat: info.frontLat,
      phone: info.tel || null,
      score: null,
    };
  } catch (e) {
    throw new Error(`Tmap API 오류: ${e.response?.data?.message || e.message}`);
  }
};
