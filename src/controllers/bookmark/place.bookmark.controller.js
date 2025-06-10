import * as bookmarkService from "../../services/bookmark/place.bookmark.service.js";
import models from "../../models/index.js";
import { getTmapPlaceInfo } from "../../utils/tmap.js";
import { Sequelize } from "sequelize";

// 장소 북마크
export const placeBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });

    const { tmapPlaceId } = req.params;

    let place = await models.Places.findOne({
      where: { tmap_place_id: tmapPlaceId },
    });

    if (!place) {
      const tmapData = await getTmapPlaceInfo(tmapPlaceId);

      const lat = parseFloat(tmapData.frontLat);
      const lon = parseFloat(tmapData.frontLon);

      console.log("lat:", lat, "lon:", lon);

      if (isNaN(lat) || isNaN(lon)) {
        throw new Error(
          `유효하지 않은 좌표값: lat=${tmapData.frontLat}, lon=${tmapData.frontLon}`
        );
      }

      const [createdPlace, created] = await models.Places.findOrCreate({
        where: { tmapPlaceId: tmapPlaceId },
        defaults: {
          tmapPlaceId: tmapPlaceId,
          name: tmapData.name,
          address: tmapData.address,
          phone: tmapData.phone,
          externalRating: null,
          location: Sequelize.fn(
            "ST_GeomFromText",
            // `POINT(${lon} ${lat})`
            `POINT(${lat} ${lon})`,
            4326
          ),
        },
      });

      if (!createdPlace?.placeId) {
        throw new Error("장소 ID 생성 실패");
      }

      place = createdPlace; // 반드시 대입 연산자 사용!
      console.log(created ? "새 장소 생성됨" : "기존 장소 찾음");
      console.log("저장된 tmap_place_id:", place.tmapPlaceId);
    }

    console.log("전달할 placeId:", place.placeId);

    const bookmark = await bookmarkService.bookmark({
      userId,
      placeId: place.placeId,
    });

    console.log("생성된 장소 ID:", place.placeId); // 숫자 확인

    res.status(201).json(bookmark);
  } catch (e) {
    console.error("북마크 생성 오류:", e);
    res.status(500).json({ message: e.message });
  }
};

//장소 북마크 조회
export const getPlaceBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });
    const { cursor, limit = 10 } = req.query;
    const bookmarks = await bookmarkService.getPlaceBookmarks({
      userId,
      cursor,
      limit: parseInt(limit),
    });
    res.status(200).json(bookmarks);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
