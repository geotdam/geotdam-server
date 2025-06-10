// src/services/socialLogin/socialLogin.service.js
import SocialLoginRepository from '../../repositories/socialLogin/socialLogin.repository.js';
import { SocialLoginDto } from '../../dtos/socialLogin/socialLogin.dto.js';

export default class SocialLoginService {
    constructor() {
      this.repo = new SocialLoginRepository();
    }

    async saveSocialLogin(data) {
      const dto = new SocialLoginDto(data);

    // 1. 기존 로직 (토큰 저장)
    await this.repo.saveSocialLogin(dto);

    // 2. 프로필 이미지 저장 추가
    if (dto.profileImageUrl) {
      console.log("📸 이미지 저장 시도:", dto.profileImageUrl);
      await this.repo.saveOrUpdateUserImage(dto.userId, dto.profileImageUrl);
    }


   return dto;
  }

  async deactivateInactiveUsers() {
    return await this.repo.deactivateInactiveUsers();
  }

  async getCurrentUser(userId) {
  return await this.repo.findByUserId(userId);
  }
}
