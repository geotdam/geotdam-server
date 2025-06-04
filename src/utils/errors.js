export const errors = {
  auth: {
    // ... existing errors ...
    KAKAO_LOGIN_ERROR: {
      code: "AUTH_KAKAO_ERROR",
      message: "카카오 로그인 중 오류가 발생했습니다.",
    },
    KAKAO_LOGIN_FAILED: {
      code: "AUTH_KAKAO_FAILED",
      message: "카카오 로그인에 실패했습니다.",
    },
    GOOGLE_LOGIN_ERROR: {
      code: "AUTH_GOOGLE_ERROR",
      message: "구글 로그인 중 오류가 발생했습니다.",
    },
    GOOGLE_LOGIN_FAILED: {
      code: "AUTH_GOOGLE_FAILED",
      message: "구글 로그인에 실패했습니다.",
    },
  },
  // ... existing code ...
  LOGIN_FAILED: {
    code: "LOGIN_FAILED",
    message: "로그인에 실패했습니다.",
  },
};
