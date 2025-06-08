import { PlaceBookmarkDto } from "../../dtos/bookmark/place.bookmark.dto.js";
import * as bookmarkRepository from "../../repositories/bookmark/place.bookmark.repository.js";

export const bookmark = async ({ placeBookmarkId, userId, placeId }) => {
  const existingBookmark = await bookmarkRepository.findBookmark({
    userId,
    placeId,
  });

  if (existingBookmark) {
    throw new Error("이미 북마크한 장소입니다");
  }

  const newBookmark = await bookmarkRepository.createBookmark({
    placeBookmarkId,
    userId,
    placeId,
  });

  return new PlaceBookmarkDto(newBookmark);
};
