import db from '../../models/index.js';
//import { QueryTypes } from 'sequelize';

// 경로 북마크 토글 (없으면 생성, 있으면 삭제)
export const toggleRouteBookmark = async ({ user_id, route_id }) => {
  // 1. 현재 북마크 상태 확인
  const existingBookmark = await db.RouteBookmarks.findOne({
    where: {
      userId: user_id,
      routeId: route_id,
    },
  });

  // 2. 이미 북마크가 있으면 삭제, 없으면 생성
  if (existingBookmark) {
    await existingBookmark.destroy();
    return {
      liked: false,
      message: '북마크가 취소되었습니다.',
    };
  } else {
    await db.RouteBookmarks.create({
      userId: user_id,
      routeId: route_id,
    });
    return {
      liked: true,
      message: '북마크가 추가되었습니다.',
    };
  }
};

// 내가 북마크한 루트 목록 커서 페이징 조회
export const getUserBookmarksByCursor = async (user_id, cursor = null, limit = 6) => {
  // 1. cursor 기반 쿼리 작성
  const { Op } = db.Sequelize;

  const where = {
    userId: user_id,
    ...(cursor && { bookmarkId: { [Op.lt]: cursor } })  // 이전 커서보다 bookmarkId가 작은 것만
  };

  // 2. 북마크 내역 조회
  const bookmarks = await db.RouteBookmarks.findAll({
    where,
    order: [['bookmarkId', 'DESC']],
    limit: limit + 1 // 다음 페이지 여부 확인용
  });

  // 3. 결과가 없는 경우 null 반환
  if (bookmarks.length === 0) {
    return null;
  }

  // 4. 다음 페이지 존재 여부 확인
  const hasNextPage = bookmarks.length > limit;
  const items = hasNextPage ? bookmarks.slice(0, -1) : bookmarks;

  // 5. 결과 반환
  return {
      bookmarks: items.map(bookmark => ({
      bookmarkId: bookmark.bookmarkId,
      routeId: bookmark.routeId,
      userId: bookmark.userId
    })),
    nextCursor: hasNextPage ? items[items.length - 1].bookmarkId : null,
    hasNextPage
  };
}; 