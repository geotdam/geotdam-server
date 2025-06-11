import axios from 'axios';
import dotenv from 'dotenv';
import db from '../models/index.js';
import { Sequelize } from 'sequelize';
import { getGooglePlaceRating } from '../services/external/placeRating.service.js'; // <- 중요

dotenv.config();

const Places = db.Places;
const PlaceReviews = db.PlaceReviews;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ADMIN_USER_ID = 1;
const DEFAULT_REVIEW_CONTENT = '구글에서 제공된 평균 별점입니다.';

const getNearbyPlacesInSeongbuk = async () => {
  const location = '37.5894,127.0167'; // 성북구청 기준 좌표
  const radius = 3000;

  const res = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
    params: {
      location,
      radius,
      type: 'restaurant',
      key: GOOGLE_API_KEY,
    },
  });

  return res.data.results.map(p => ({
    name: p.name,
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    address: p.vicinity || null,
  }));
};

export const initGoogleRatingsIfNeeded = async () => {
  const dummyExists = await PlaceReviews.findOne({
    where: { userId: ADMIN_USER_ID },
  });

  if (dummyExists) {
    console.log(' 더미 리뷰가 이미 존재합니다. 초기화 건너뜁니다.');
    return;
  }

  console.log('[초기화 시작] 구글 장소 조회 + 별점 수집 + 장소/리뷰 등록');

  const places = await getNearbyPlacesInSeongbuk();

  for (const { name, lat, lng, address } of places) {
    try {
      // 별점 정보 가져오기
      const { rating, participant } = await getGooglePlaceRating(name);
      console.log(`[DEBUG] ${name} → rating: ${rating}, participant: ${participant}`);

      if (rating === 0 && participant === 0) {
        console.warn(`구구글에서 별점 정보 없음: ${name}`);
        continue;
      }

      // 장소 저장 (중복 체크)
      let place = await Places.findOne({ where: { name } });

      if (!place) {
        place = await Places.create({
          name,
          address,
          location: Sequelize.fn('POINT', lng, lat),
            externalRating: rating,
            externalRatingParticipant: participant,
            correctedRating: rating,
        });
        console.log(`장소 생성 완료: ${name}, ID = ${place.placeId || place.id || place.place_id}`);
      } else {
        const [affected] = await Places.update(
          {
              externalRating: rating,
              externalRatingParticipant: participant,
              correctedRating: rating,
          },
          { where: { placeId: place.placeId || place.id || place.place_id } }
        );
        console.log(`장소 업데이트 완료: ${name}, affected = ${affected}`);
      }

      // 리뷰 생성
      await PlaceReviews.create({
        placeId: place.placeId || place.id || place.place_id,
        userId: ADMIN_USER_ID,
        rating,
        content: DEFAULT_REVIEW_CONTENT,
      });

      console.log(`${name} → 더미 리뷰 등록 완료`);
    } catch (err) {
      console.error(`${name} 처리 중 오류:`, err.message);
    }
  }

  console.log('초기화 완료: 성북구 장소 + 구글 별점 + 더미 리뷰');
};
