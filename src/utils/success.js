export const success = {
  auth: {
    // ... existing success responses ...
    LOGIN_SUCCESS: (data) => ({
      code: 'AUTH_LOGIN_SUCCESS',
      message: '로그인에 성공했습니다.',
      data
    })
  },
  // ... existing code ...
}; 