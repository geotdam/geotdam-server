/**
 * 상속받아 사용하는 에러 클래스
 */
export class CustomError extends Error {
  constructor(reason, errorCode, statusCode, data = null) {
    super(reason); // error.message = reason
    this.reason = reason; // error.reason = reason
    this.name = this.constructor.name;
    this.errorCode = errorCode; // 한두단어로 에러표시. "SAMPLE_ERROR"
    this.statusCode = statusCode; // 해당 에러 발생 시 전달할 응답코드. 500
    this.data = data; // 추가 에러 데이터.
    Error.captureStackTrace(this, this.constructor);
  }
}
/**
 * 에러 추가 예시 500
 */
export class SampleError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "SAMPLE_ERROR", 500, data);
  }
}

/**
 * 사용자가 입력값 잘 못 넣은 경우 400
 */
export class InvalidInputError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "INVALID_INPUT", 400, data);
  }
}

/**
 * 요청한게 이미 존재하는 경우 409
 */
export class AlreadyExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "ALREADY_EXISTS", 409, data);
  }
}

/**
 * 요청한게 존재하지 않는 경우 404
 */
export class NotExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_EXISTS", 404, data);
  }
}

/**
 * 인증은 되었으나 권한이 부족한 경우 403
 */
export class NotAllowedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_ALLOWED", 403, data);
  }
}

/**
 * 인증 정보가 제공되어 있지 않은 경우 401
 */
export class UnauthorizedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "UNAUTHORIZED", 401, data);
  }
}

/**
 * 디버깅용
 */
// class UnknownError extends CustomError {
//   constructor(reason, data = null) {
//     super(reason, "UNKNOWN_ERROR", 500, data);
//   }
// }
