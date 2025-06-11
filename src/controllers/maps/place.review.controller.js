//컨트롤러
import { createOrUpdateReview, getPaginatedReviews } from '../../services/maps/place.review.service.js';
import { OkSuccess } from '../../utils/success/success.js';
import { getTmapPlaceInfo } from "../../utils/tmap.js";
import { Sequelize } from "sequelize";
import models from "../../models/index.js";

// 사용자 리뷰 생성 or 수정
export const createPlaceReview = async (req, res, next) => {
  const { tmapPlaceId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId;

  try {
    let place = await models.Places.findOne({ where: { tmap_place_id: tmapPlaceId } });

    if (!place) {
      const tmapData = await getTmapPlaceInfo(tmapPlaceId);
      const lat = parseFloat(tmapData.frontLat);
      const lon = parseFloat(tmapData.frontLon);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ message: `유효하지 않은 좌표값: lat=${lat}, lon=${lon}` });
      }

      const [createdPlace] = await models.Places.findOrCreate({
        where: { tmap_place_id: tmapPlaceId },
        defaults: {
          tmap_place_id: tmapPlaceId,
          name: tmapData.name,
          address: tmapData.address,
          phone: tmapData.phone,
          external_rating: null,
          location: Sequelize.fn("ST_GeomFromText", `POINT(${lat} ${lon})`, 4326),
        },
      });

      place = createdPlace;
    }

    const result = await createOrUpdateReview({
      placeId: place.placeId, // 수정된 부분
      userId,
      content,
      rating,
    });

    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
    next(error);
  }
};

//장소 리뷰 목록 (페이징 포함)
export const getPlaceReviews = async (req, res, next) => {
  const { tmapPlaceId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const place = await models.Places.findOne({ where: { tmap_place_id: tmapPlaceId } });

    if (!place) {
      return res.status(404).json({ message: '해당 장소를 찾을 수 없습니다.' });
    }

    const result = await getPaginatedReviews(place.placeId, page, limit);
    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
    next(error);
  }
};
