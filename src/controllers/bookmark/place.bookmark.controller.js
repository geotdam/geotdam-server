import * as bookmarkService from "../../services/bookmark/place.bookmark.service.js";
import models from "../../models/index.js";
import { getTmapPlaceInfo } from "../../utils/tmap.js";
import { Sequelize } from "sequelize";

// 장소 북마크
export const placeBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId:", userId);
    if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });

    const { tmapPlaceId } = req.params;
    console.log(tmapPlaceId);

    // 1. Tmap ID로 조회 시도
    let place = await models.Places.findOne({
      where: { tmap_place_id: tmapPlaceId },
    });

    // 2. 없으면 Tmap API에서 데이터 조회
    if (!place) {
      const tmapData = await getTmapPlaceInfo(tmapPlaceId);

      // 3. 조회한 데이터로 findOrCreate 실행
      [place] = await models.Places.findOrCreate({
        where: { tmap_place_id: tmapPlaceId },
        defaults: {
          tmap_place_id: tmapPlaceId,
          name: tmapData.name,
          address: tmapData.address,
          location: Sequelize.fn(
            "ST_GeomFromText",
            `POINT(${tmapData.frontLon} ${tmapData.frontLat})`
          ),
          phone: tmapData.phone,
          external_rating: tmapData.score,
        },
      });
    }
    console.log("Tmap API 응답:", response.data);
    console.log(created ? "새 장소 생성됨" : "기존 장소 찾음");

    // 찾거나 생성된 place의 place_id로 북마크 생성
    const bookmark = await bookmarkService.bookmark({
      userId,
      placeId: place.place_id, // 내부 place_id 사용
    });

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
