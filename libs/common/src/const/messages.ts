export const SUCCESS_MESSAGES = {
  USER_REGISTRATION_SUCCESS: 'User registration successful',
  FILE_UPLOADED_SUCCESS: 'Files are being processed',
  VALIDATE_GOOGLE_TOKEN_SUCCESS: 'Google token is valid',
};

export const ERROR_MESSAGES = {
  // 인증 관련 오류 메시지
  UNAUTHORIZED_TOKEN: 'Token is required!',
  INVALID_CREDENTIALS: 'Invalid credentials!',
  ACCESS_DENIED: 'Access denied!',

  // User 등록 오류 메시지
  USER_REGISTRATION_FAILED: 'User registration failed',

  // 토큰 관련 오류 메시지
  INVALID_TOKEN_FORMAT: 'Token format is incorrect',
  INVALID_BASIC_TOKEN: 'It is not a Basic token',
  INVALID_BEARER_TOKEN: 'It is not a Bearer token',
  INVALID_REFRESH_TOKEN: 'It is not a Refresh token',
  INVALID_ACCESS_TOKEN: 'It is not an Access token',
  TOKEN_EXPIRED: 'Token has expired!',
  TOKEN_GUARD_MISSING: 'TokenGuard is missing!',
  INVALID_GOOGLE_TOKEN: 'Google token is invalid',
  EMAIL_NOT_VERIFIED: 'Email is not verified',

  // User 관련 오류 메시지
  USER_NOT_FOUND: 'User does not exist!',
  EMAIL_ALREADY_EXISTS: 'Email already exists!',
  INCORRECT_PASSWORD: 'Incorrect password',
};
