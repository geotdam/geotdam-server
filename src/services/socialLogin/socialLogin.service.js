// src/services/socialLogin/socialLogin.service.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import SocialLoginRepository from '../../repositories/socialLogin/socialLogin.repository.js';
import { SocialLoginDto } from '../../dtos/socialLogin/socialLogin.dto.js';
import dayjs from 'dayjs';

export default class SocialLoginService {
  constructor() {
    this.repo = new SocialLoginRepository();
  }

  async kakaoLogin(code, state = 'normal') {
    const accessToken = await this._getKakaoAccessToken(code);
    const userInfo = await this._getKakaoUserInfo(accessToken);

    const {
      email, nickname, name, gender, birth
    } = userInfo;

    let user = await this.repo.findByEmail(email);

    if (!user && email) {
      user = await this.repo.createUser({
        email,
        nickname,
        name,
        gender,
        birth,
        password: '',
        status: 'active',
      });
    } else {
      if (user.status === 'deactivated') {
        if (state === 'normal') return { reconsentUrl: this._buildReconsentUrl() };
        await this.repo.updateStatus(user.userId, 'active');
      }

      await this.repo.updateLastLogin(user.userId);
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

    await this.repo.saveSocialLogin(new SocialLoginDto({
      userId: user.userId,
      accessToken: token,
      email,
      platform: 'kakao',
    }));

    return { token };
  }

  async googleLogin(code) {
    const { access_token } = await this._getGoogleAccessToken(code);
    const userInfo = await this._getGoogleUserInfo(access_token);

    const {
      email, name, nickname, birth, gender
    } = userInfo;

    let user = await this.repo.findByEmail(email);

    if (!user && email) {
      user = await this.repo.createUser({
        email,
        nickname,
        name,
        gender,
        birth,
        password: '',
        status: 'active',
      });
    } else {
      if (user.status === 'deactivated') {
        await this.repo.updateStatus(user.userId, 'active');
      }

      await this.repo.updateLastLogin(user.userId);
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

    await this.repo.saveSocialLogin(new SocialLoginDto({
      userId: user.userId,
      accessToken: token,
      email,
      platform: 'google',
    }));

    
    return { token };
  }

  async deactivateInactiveUsers() {
    return await this.repo.deactivateInactiveUsers();
  }

  _buildReconsentUrl() {
    const base = 'https://kauth.kakao.com/oauth/authorize';
    const params = new URLSearchParams({
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      response_type: 'code',
      state: 'reconsent',
      prompt: 'consent'
    });
    return `${base}?${params.toString()}`;
  }

  async _getKakaoAccessToken(code) {
    const res = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    return res.data.access_token;
  }

  async _getKakaoUserInfo(accessToken) {
    const res = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = res.data;
    const account = data.kakao_account || {};
    const profile = account.profile || {};

    const birth = account.birthyear && account.birthday
      ? dayjs(`${account.birthyear}-${account.birthday}`, 'YYYY-MM-DD').toDate()
      : null;

    return {
      kakaoId: data.id,
      email: account.email || null,
      nickname: profile.nickname || '카카오유저',
      name: account.name || null,
      gender: account.gender || null,
      birth,
    };
  }

  async _getGoogleAccessToken(code) {
    const res = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });
    return res.data;
  }

  async _getGoogleUserInfo(accessToken) {
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const peopleRes = await axios.get('https://people.googleapis.com/v1/people/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { personFields: 'genders,birthdays' },
    });

    const birthday = peopleRes.data.birthdays?.[0]?.date;
    const birth = birthday
      ? new Date(`${birthday.year || 2000}-${String(birthday.month).padStart(2, '0')}-${String(birthday.day).padStart(2, '0')}`)
      : null;

    const gender = peopleRes.data.genders?.[0]?.value?.toLowerCase() || null;

    return {
      googleId: userRes.data.sub,
      email: userRes.data.email,
      name: userRes.data.name,
      nickname: userRes.data.name,
      birth,
      gender,
    };
  }
}
