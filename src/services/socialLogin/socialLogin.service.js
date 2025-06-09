// src/services/socialLogin/socialLogin.service.js
import SocialLoginRepository from '../../repositories/socialLogin/socialLogin.repository.js';
import { SocialLoginDto } from '../../dtos/socialLogin/socialLogin.dto.js';

export default class SocialLoginService {
  constructor() {
    this.repo = new SocialLoginRepository();
  }

  async saveSocialLogin(data) {
    return await this.repo.saveSocialLogin(new SocialLoginDto(data));
  }

  async deactivateInactiveUsers() {
    return await this.repo.deactivateInactiveUsers();
  }

  async getCurrentUser(userId) {
  return await this.repo.findByUserId(userId);
  }
}
