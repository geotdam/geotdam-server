class SuccessResponse {
  constructor(result = null, code = "COMMON200", message = "성공입니다.") {
    this.isSuccess = true;
    this.code = code;
    this.message = message;
    this.result = result;
  }
}

class OkSuccess extends SuccessResponse {
  constructor(result = null, message = "성공입니다.") {
    super(result, "COMMON200", message);
  }
}

class CreatedSuccess extends SuccessResponse {
  constructor(result = null, message = "생성이 완료되었습니다.") {
    super(result, "COMMON201", message);
  }
}

class NoContentSuccess extends SuccessResponse {
  constructor() {
    super(null, "COMMON204", "내용이 없습니다.");
  }
}

module.exports = {
  OkSuccess,
  CreatedSuccess,
  NoContentSuccess,
};
