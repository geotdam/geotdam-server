import { PlaceBookmarkDto } from "../../dtos/bookmark/place.bookmark.dto.js";
import * as bookmarkRepository from "../../repositories/bookmark/place.bookmark.repository.js";

export const bookmark = async ({ userId, placeId }) => {
  const existingBookmark = await bookmarkRepository.findBookmark({
    userId,
    placeId,
  });

  if (existingBookmark) {
    throw new Error("이미 북마크한 장소입니다");
  }

  const newBookmark = await bookmarkRepository.createBookmark({
    userId,
    placeId,
  });

  return new PlaceBookmarkDto(newBookmark);
};

export const getPlaceBookmarks = async ({ userId, cursor, limit }) => {
  const bookmarks = await bookmarkRepository.findPlaceBookmarksByCursor({
    userId,
    cursor,
    limit,
  });

  const results = bookmarks.map(bookmark => ({
    ...new PlaceBookmarkDto(bookmark),
    place: {
      name: bookmark.place?.name || null,
      category: bookmark.place?.category || null,
    },
  }));

  const nextCursor = results.length > 0 ? results[results.length - 1].placeBookmarkId : null;

  return {
    bookmarks: results,
    nextCursor,
  };
};