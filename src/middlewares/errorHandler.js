import { CustomError } from "../utils/errors/errors.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.reason,
      data: err.data || null,
    });
  }

  // 그 외 알 수 없는 에러
  console.error("serverError:", err);

  return res.status(500).json({
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  });
};