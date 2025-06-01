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

  // 2. 이미 북마크크가 있으면 삭제, 없으면 생성
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

// // 추천 경로 조회 (좋아요 순, cursor 기반 페이징)
// export const getRecommendedRoutes = async (cursor = null, limit = 6) => {
//   // 1. cursor 기반 쿼리 작성
//   const cursorCondition = cursor 
//     ? `AND (
//          (COUNT(rl.like_id) < (SELECT COUNT(rl2.like_id) FROM routeLikes rl2 WHERE rl2.route_id = :cursor))
//          OR 
//          (COUNT(rl.like_id) = (SELECT COUNT(rl2.like_id) FROM routeLikes rl2 WHERE rl2.route_id = :cursor) 
//           AND r.route_id > :cursor)
//        )`
//     : '';

//   // 2. 좋아요 수와 함께 경로 조회
//   const routes = await db.sequelize.query(
//     `SELECT 
//       r.route_id as routeId,
//       r.name,
//       COALESCE((SELECT ri.route_img_url FROM routeImgs ri WHERE ri.route_id = r.route_id LIMIT 1), '') as imageUrl,
//       COUNT(rl.like_id) as likeCount
//     FROM routes r
//     LEFT JOIN routeLikes rl ON r.route_id = rl.route_id
//     GROUP BY r.route_id, r.name
//     HAVING 1=1 ${cursorCondition}
//     ORDER BY likeCount DESC, r.route_id ASC
//     LIMIT :limit`,
//     {
//       replacements: { 
//         cursor: cursor ? parseInt(cursor) : null,
//         limit: limit + 1  // 다음 페이지 존재 여부 확인을 위해 limit + 1개 조회
//       },
//       type: QueryTypes.SELECT
//     }
//   );

//   // 3. 결과가 없는 경우 null 반환
//   if (routes.length === 0) {
//     return null;
//   }

//   // 4. 다음 페이지 존재 여부 확인
//   const hasNextPage = routes.length > limit;
//   const items = hasNextPage ? routes.slice(0, -1) : routes;

//   // 5. 결과 반환
//   return {
//     routes: items.map(route => ({
//       name: route.name,
//       imageUrl: route.imageUrl || ""
//     })),
//     pageInfo: {
//       hasNextPage,
//       endCursor: hasNextPage ? items[items.length - 1].routeId.toString() : null
//     }
//   };
// }; 