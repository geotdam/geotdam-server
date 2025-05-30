import { toggleRouteLike, getRecommendedRoutes } from '../../repositories/like/like.repository.js';
import { OkSuccess, NoContentSuccess } from '../../utils/success/success.js';
import { NotExistsError } from '../../utils/errors/errors.js';
import db from '../../models/index.js';

console.log('Available models:', Object.keys(db));

export const handleRouteLikeToggle = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT에서 추출한 사용자 ID
    const routeId = parseInt(req.params.routeId);

    // 1. 사용자 존재 여부 확인
    const user = await db.Users.findByPk(userId);
    if (!user) {
      throw new NotExistsError("해당 사용자를 찾을 수 없습니다.");
    }

    // 2. 루트 존재 여부 확인
    const route = await db.Routes.findByPk(routeId);
    if (!route) {
      throw new NotExistsError("좋아요할 루트를 찾을 수 없습니다.");
    }

    // 3. 좋아요 토글 실행
    const result = await toggleRouteLike({
      user_id: userId,
      route_id: routeId,
    });

    // 4. 성공 응답
    return res.status(200).json(
      new OkSuccess(
        result.liked ? "좋아요 성공했습니다." : "좋아요가 취소되었습니다."
      )
    );

  } catch (err) {
    console.error('Error in handleRouteLikeToggle:', err);
    if (err instanceof NotExistsError) {
      return res.status(404).json({
        isSuccess: false,
        code: err.errorCode,
        message: err.message,
        result: null
      });
    }
    return res.status(400).json({
      isSuccess: false,
      code: "COMMON400",
      message: "잘못된 요청입니다.",
      result: null
    });
  }
};

export const handleRecommendedRoutes = async (req, res) => {
  try {
    // 1. cursor 파라미터 처리 (옵셔널)
    const cursor = req.query.cursor || null;
    
    // 2. 추천 경로 조회
    const result = await getRecommendedRoutes(cursor);

    // 3. 결과가 없는 경우 204 응답
    if (!result || result.routes.length === 0) {
      return res.status(204).json({
        isSuccess: true,
        code: "COMMON204",
        message: "추천할 경로가 없습니다."
      });
    }

    // 4. 성공 응답 (페이지 정보 포함)
    return res.status(200).json({
      isSuccess: true,
      code: "COMMON200",
      message: "성공입니다.",
      result: result.routes,
      pageInfo: result.pageInfo
    });

  } catch (err) {
    console.error('Error in handleRecommendedRoutes:', err);
    return res.status(400).json({
      isSuccess: false,
      code: "COMMON400",
      message: "잘못된 요청입니다.",
      result: null
    });
  }
};
