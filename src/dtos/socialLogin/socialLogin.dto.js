export class SocialLoginDto {
    constructor({ userId, accessToken, email, platform }) {
      this.userId = userId;
      this.accessToken = accessToken;
      this.email = email;
      this.platform = platform;
    }
  }
  