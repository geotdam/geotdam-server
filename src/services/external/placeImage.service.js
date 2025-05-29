import axios from "axios";
import { GOOGLE_API_KEY } from '../../../config/google.config.js';

// 장소 이름으로 Google Place API를 통해 이미지 URL을 가져옴

export const getPlaceImageUrl = async (placeName) => {
  try {
    // 장소 검색 (Place Search API)
    const searchRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: placeName,
          inputtype: "textquery",
          fields: "place_id",
          key: GOOGLE_API_KEY,
        },
      }
    );

    const placeId = searchRes.data?.candidates?.[0]?.place_id;
    if (!placeId) return null;

    // 상세 정보에서 photoReference 추출
    const detailsRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "photo",
          key: GOOGLE_API_KEY,
        },
      }
    );

    const photoReference =
      detailsRes.data?.result?.photos?.[0]?.photo_reference;

    if (!photoReference) return null;

    // 실제 이미지 URL 구성
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
    return photoUrl;
  } catch (error) {
    console.error("getPlaceImageUrl error:", error.message);
    return null;
  }
};
