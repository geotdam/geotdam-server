import axios from "axios";

// export const getTmapPlaceInfo = async (tmapId) => {
//   try {
//     const response = await axios.get(
//       `https://apis.openapi.sk.com/tmap/pois/${tmapId}`,
//       { headers: { appKey: process.env.TMAP_API_KEY } }
//     );

//     return {
//       name: response.data.name,
//       address: response.data,
//       frontLon: response.data.frontLon, // 경도
//       frontLat: response.data.frontLat, // 위도
//       phone: response.data.telNo || null,
//       score: response.data.score ? parseFloat(response.data.score) : null,
//     };
//   } catch (e) {
//     throw new Error(`Tmap API 오류: ${e.response?.data?.message || e.message}`);
//   }
// };

export const getTmapPlaceInfo = async (tmapId) => {
  try {
    const response = await axios.get(
      `https://apis.openapi.sk.com/tmap/pois/${tmapId}`,
      { headers: { appKey: process.env.TMAP_API_KEY } }
    );

    // ✅ 실제 응답 데이터 구조 확인
    console.log(
      "Tmap API 응답 데이터:",
      JSON.stringify(response.data, null, 2)
    );

    // address를 문자열로 추출
    const address =
      response.data.newAddressList &&
      response.data.newAddressList.newAddress &&
      response.data.newAddressList.newAddress.length > 0
        ? response.data.newAddressList.newAddress[0].fullAddressRoad
        : "";

    return {
      name: response.data.name,
      address, // 반드시 문자열만!
      frontLon: response.data.frontLon,
      frontLat: response.data.frontLat,
      phone: response.data.telNo || null,
      score: response.data.score ? parseFloat(response.data.score) : null,
    };
  } catch (e) {
    throw new Error(`Tmap API 오류: ${e.response?.data?.message || e.message}`);
  }
};
