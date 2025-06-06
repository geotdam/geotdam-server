import * as bookmarkService from "../../services/bookmark/place.bookmark.service.js";

// 장소 북마크
export const placeBookmark = async (req, res) => {
  try {
    const bookmark = await bookmarkService.bookmark(req.body);
    res.status(201).json(bookmark);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
