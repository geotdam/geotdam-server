// src/repositories/maps/place.repository.js
import db from '../../models/index.js';
const Place = db.places; // models/database/places.js의 export

// 1. 장소 저장
export const createPlace = async ({ name, location, address, description = null, sequence = null }) => {
  const place = await Place.create({
    name,
    location, // '위도,경도' 문자열
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
