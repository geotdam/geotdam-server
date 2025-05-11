import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT 인증 미들웨어
 * - 요청 헤더의 Authorization: Bearer <token>에서 토큰을 추출
 * - 토큰이 유효하면 req.user에 디코드된 정보를 할당
 * - 토큰이 없거나 유효하지 않으면 401 에러 반환
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없거나 Bearer 토큰이 아닌 경우
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 이후 미들웨어/컨트롤러에서 req.user로 접근 가능
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

/**
 * 로그인 또는 회원가입 요청에서 토큰이 필요하지 않은 경우
 * - 필요시 미들웨어를 사용하지 않고 라우터에 직접 컨트롤러 연결
 * - 예: router.post('/login', loginController)
 * - 예: router.post('/register', registerController)
 */

export default authenticateJWT;
