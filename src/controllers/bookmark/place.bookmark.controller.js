import * as bookmarkService from "../../services/bookmark/place.bookmark.service.js";
import models from "../../models/index.js";

// 장소 북마크
export const placeBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId:", userId);
    if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });

    const { placeId } = req.params;
    console.log("placeId:", placeId);

    // places 테이블에서 placeId 존재 여부 확인
    const placeExists = await models.Places.findOne({
      where: { place_id: placeId },
    });
    if (!placeExists) {
      return res.status(404).json({ message: "존재하지 않는 장소입니다." });
    }

    const bookmark = await bookmarkService.bookmark({
      userId,
      placeId,
    });
    res.status(201).json(bookmark);
  } catch (e) {
    res.status(400).json({ message: e.message });
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
