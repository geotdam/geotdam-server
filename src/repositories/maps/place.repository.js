// src/repositories/maps/place.repository.js
import db from '../../models/index.js';
const Place = db.places; // models/database/places.js의 export

const toWKT = (value) => {
  // value가 이미 POINT 형식인지 확인
  if (typeof value === 'string') {
    if (value.startsWith('POINT(')) {
      return value; // 이미 POINT 형식이면 그대로 반환
    }
    // 위도,경도 → POINT(경도 위도)로 변환
    const [lat, lng] = value.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid location string format. Expected "latitude,longitude".');
    }
    return `POINT(${lng} ${lat})`;
  }

  // 객체 타입 등 다른 형식이 들어온 경우 처리
  throw new Error('Invalid location type. Expected string.');
};

export const createPlace = async ({ name, location, address, description = null, sequence = null }) => {
  const place = await Place.create({
    name,
    location: toWKT(location),
    address,
    description,
    sequence,
  });

  return place;
};


// 2. 검색어에 따라 장소 조회 (이름 포함, 대소문자 무시)
export const findPlacesByKeyword = async (keyword) => {
  const { Op } = db.Sequelize;

  const places = await Place.findAll({
    where: {
      name: {
        [Op.like]: `%${keyword}%`,
      },
    },
  });

  return places;
};

// 3. place_id로 단건 조회
export const findPlaceById = async (place_id) => {
  return await Place.findByPk(place_id);
};

// 4. 전체 장소 조회 (sequence 기준 정렬)
export const getAllPlaces = async () => {
  return await Place.findAll({
    order: [['sequence', 'ASC']],
  });
};
