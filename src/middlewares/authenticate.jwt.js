import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT 인증 미들웨어
 * - Authorization: Bearer <token>에서 토큰 추출
 * - 토큰이 유효하면 req.user에 payload 할당
 * - 토큰이 없거나 유효하지 않으면 401 에러 반환
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // 토큰 만료 에러와 기타 에러 구분
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      }
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
    req.user = decoded; // payload 전체 할당 (userId 등)
    next();
  });
};

export default authenticateJWT;
