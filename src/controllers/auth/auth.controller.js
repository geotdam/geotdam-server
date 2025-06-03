import SocialLoginService from '../../services/socialLogin/socialLogin.service.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { errors } from '../../utils/errors.js';
import { success } from '../../utils/success.js';

const service = new SocialLoginService();

export const kakaoLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await service.kakaoLogin(code);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ 카카오 로그인 오류:", error); // 실제 에러 확인
    res.status(500).json({ message: "카카오 로그인 실패" });
  }
};

export const kakaoLoginRedirect = (req, res, next) => {
  const isApi = req.query.response_type === 'json';
  passport.authenticate('kakao')(req, res, next);
};

export const kakaoCallback = (req, res, next) => {
  const isApi = req.query.response_type === 'json';
  
  passport.authenticate('kakao', async (err, user) => {
    try {
      if (err) {
        if (isApi) {
          return res.status(500).json(errors.auth.KAKAO_LOGIN_ERROR);
        }
        const redirectUrl = `${process.env.KAKAO_FAILURE_REDIRECT_URI}?error=server_error`;
        return res.redirect(redirectUrl);
      }
      
      if (!user) {
        if (isApi) {
          return res.status(401).json(errors.auth.KAKAO_LOGIN_FAILED);
        }
        const redirectUrl = `${process.env.KAKAO_FAILURE_REDIRECT_URI}?error=login_failed`;
        return res.redirect(redirectUrl);
      }

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

      await service.saveSocialLogin({
        userId: user.userId,
        accessToken: token,
        email: user.email,
        platform: 'kakao'
      });

      if (isApi) {
        return res.status(200).json(success.auth.LOGIN_SUCCESS({ token }));
      }

      const redirectUrl = `${process.env.KAKAO_SUCCESS_REDIRECT_URI}?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      if (isApi) {
        return res.status(500).json(errors.auth.KAKAO_LOGIN_ERROR);
      }
      const redirectUrl = `${process.env.KAKAO_FAILURE_REDIRECT_URI}?error=server_error`;
      res.redirect(redirectUrl);
    }
  })(req, res, next);
};

export const googleLoginRedirect = (req, res, next) => {
  const isApi = req.query.response_type === 'json';
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read']
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  const isApi = req.query.response_type === 'json';

  passport.authenticate('google', async (err, user) => {
    try {
      if (err) {
        if (isApi) {
          return res.status(500).json(errors.auth.GOOGLE_LOGIN_ERROR);
        }
        const redirectUrl = `${process.env.GOOGLE_FAILURE_REDIRECT_URI}?error=server_error`;
        return res.redirect(redirectUrl);
      }
      
      if (!user) {
        if (isApi) {
          return res.status(401).json(errors.auth.GOOGLE_LOGIN_FAILED);
        }
        const redirectUrl = `${process.env.GOOGLE_FAILURE_REDIRECT_URI}?error=login_failed`;
        return res.redirect(redirectUrl);
      }

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

      await service.saveSocialLogin({
        userId: user.userId,
        accessToken: token,
        email: user.email,
        platform: 'google'
      });

      if (isApi) {
        return res.status(200).json(success.auth.LOGIN_SUCCESS({ token }));
      }

      const redirectUrl = `${process.env.GOOGLE_SUCCESS_REDIRECT_URI}?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      if (isApi) {
        return res.status(500).json(errors.auth.GOOGLE_LOGIN_ERROR);
      }
      const redirectUrl = `${process.env.GOOGLE_FAILURE_REDIRECT_URI}?error=server_error`;
      res.redirect(redirectUrl);
    }
  })(req, res, next);
};
