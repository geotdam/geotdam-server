import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import SocialLoginRepository from '../repositories/socialLogin/socialLogin.repository.js';

const repo = new SocialLoginRepository();

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await repo.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Kakao Strategy
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_REST_API_KEY,
    callbackURL: process.env.KAKAO_REDIRECT_URI,
    state: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile._json?.kakao_account?.email;
      const nickname = profile._json?.properties?.nickname || '카카오유저';
      const name = profile._json?.kakao_account?.name;
      const gender = profile._json?.kakao_account?.gender;
      const birthyear = profile._json?.kakao_account?.birthyear;
      const birthday = profile._json?.kakao_account?.birthday;
      
      if (!email) {
        return done(new Error('이메일 정보를 가져올 수 없습니다.'), null);
      }

      const birth = birthyear && birthday
        ? new Date(`${birthyear}-${birthday}`)
        : null;

      let user = await repo.findByEmail(email);

      if (!user) {
        try {
          user = await repo.createUser({
            email,
            nickname,
            name,
            gender,
            birth,
            password: '',
            status: 'active'
          });
        } catch (createError) {
          return done(createError, null);
        }
      } else {
        if (user.status === 'deactivated') {
          try {
            await repo.updateStatus(user.userId, 'active');
          } catch (updateError) {
            return done(updateError, null);
          }
        }
        try {
          await repo.updateLastLogin(user.userId);
        } catch (loginError) {
          return done(loginError, null);
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const nickname = profile.displayName;
      
      let user = await repo.findByEmail(email);

      if (!user && email) {
        user = await repo.createUser({
          email,
          nickname,
          name,
          gender: null, // Google API에서 gender 정보 가져오기 위해서는 추가 People API 호출 필요
          birth: null,  // Google API에서 birth 정보 가져오기 위해서는 추가 People API 호출 필요
          password: '',
          status: 'active'
        });
      } else if (user) {
        if (user.status === 'deactivated') {
          await repo.updateStatus(user.userId, 'active');
        }
        await repo.updateLastLogin(user.userId);
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
)); 