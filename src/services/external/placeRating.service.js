import axios from "axios";
import { GOOGLE_API_KEY } from '../../../config/google.config.js';

export const getGooglePlaceRating = async (placeName) => {
  try {
    // 1. 장소 ID 조회
    const searchRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
      {
        params: {
          input: placeName,
          inputtype: 'textquery',
          fields: 'place_id',
          key: GOOGLE_API_KEY
        },
      }
    );

    const placeId = searchRes.data?.candidates?.[0]?.place_id;
    if (!placeId) return { rating: 0, participant: 0 };

    //2. 상세 정보 조회 (rating 포함해서서)
    const detailsRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'rating,user_ratings_total',
          key: GOOGLE_API_KEY
        },
      }
    );

    const result = detailsRes.data?.result;
    return {
      rating: result?.rating ?? 0,
      participant: result?.user_ratings_total ?? 0
    };
  } catch (error) {
    console.error('getGooglePlaceRating error:', error.message);
    return { rating: 0, participant: 0 };
  }
};
