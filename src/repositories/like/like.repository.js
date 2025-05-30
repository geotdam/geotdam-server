import db from '../../models/index.js';

// 7. 경로 좋아요 토글 (없으면 생성, 있으면 삭제)
export const toggleRouteLike = async ({ user_id, route_id }) => {
  // 1. 현재 좋아요 상태 확인
  const existingLike = await db.RouteLikes.findOne({
    where: {
      userId: user_id,
      routeId: route_id,
    },
  });

  // 2. 이미 좋아요가 있으면 삭제, 없으면 생성
  if (existingLike) {
    await existingLike.destroy();
    return {
      liked: false,
      message: '좋아요가 취소되었습니다.',
    };
  } else {
    await db.RouteLikes.create({
      userId: user_id,
      routeId: route_id,
    });
    return {
      liked: true,
      message: '좋아요가 추가되었습니다.',
    };
  }
}; 