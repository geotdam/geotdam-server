import { toggleRouteBookmark, getUserBookmarksByCursor } from '../../repositories/bookmark/bookmark.repository.js';
import { OkSuccess, NoContentSuccess } from '../../utils/success/success.js';
import { NotExistsError } from '../../utils/errors/errors.js';
import db from '../../models/index.js';

console.log('Available models:', Object.keys(db));

export const handleRouteBookmarkToggle = async (req, res) => {
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
      throw new NotExistsError("북마크할 루트를 찾을 수 없습니다.");
    }

    // 3. 북마크 토글 실행
    const result = await toggleRouteBookmark({
      user_id: userId,
      route_id: routeId,
    });

    // 4. 성공 응답
    return res.status(200).json(
      new OkSuccess(
        result.liked ? "북마크 성공했습니다." : "북마크가 취소되었습니다."
      )
    );

  } catch (err) {
    console.error('Error in handleRouteBookmarkToggle:', err);
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

export const handleGetUserBookmarks = async (req, res) => {
  try {
    // 1. cursor 파라미터 처리 (옵셔널)
    const userId = req.user.userId;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    
    // 2. 북마크 조회
    const user = await db.Users.findByPk(userId);
      if (!user) {
        throw new NotExistsError("해당 사용자를 찾을 수 없습니다.");
      }
    const result = await getUserBookmarksByCursor(userId, cursor);

    // 3. 결과가 없는 경우 204 응답
    if (!result) {
      return res.status(204).json({
        isSuccess: true,
        code: "COMMON204",
        message: "북마크한 루트가 없습니다.",
        result: [],
        nextCursor: null,
        hasNextPage: false
      });
    }

    // 4. 성공 응답 (페이지 정보 포함)
    return res.status(200).json({
      isSuccess: true,
      code: "COMMON200",
      message: "성공입니다.",
      rresult: result.bookmarks,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage
    });

  } catch (err) {
    console.error('Error in handleGetUserBookmarks:', err);
    return res.status(400).json({
      isSuccess: false,
      code: "COMMON400",
      message: "잘못된 요청입니다.",
      result: null
    });
  }
};
