// src/dtos/socialLogin/socialLogin.dto.js
export class SocialLoginDto {
    constructor({ userId, accessToken, email, platform, profileImageUrl }) {
      this.userId = userId;
      this.accessToken = accessToken;
      this.email = email;
      this.platform = platform;
      this.profileImageUrl = profileImageUrl;
    }
  }
  