import { toggleRouteLike } from '../../repositories/like/like.repository.js';
import { OkSuccess } from '../../utils/success/success.js';
import { NotExistsError } from '../../utils/errors/errors.js';
import db from '../../models/index.js';
const Route = db.routes;

export const handleRouteLikeToggle = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT에서 추출한 사용자 ID
    const routeId = parseInt(req.params.routeId);

    // 1. 사용자 존재 여부 확인
    const user = await db.users.findByPk(userId);
    if (!user) {
      throw new NotExistsError("해당 사용자를 찾을 수 없습니다.");
    }

    // 2. 루트 존재 여부 확인
    const route = await Route.findByPk(routeId);
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
