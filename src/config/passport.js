import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import SocialLoginRepository from '../repositories/socialLogin/socialLogin.repository.js';
import { google } from 'googleapis';

const repo = new SocialLoginRepository();

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await repo.findById(userId);
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
      const imageUrl = profile._json?.properties?.profile_image;
      
      if (!email) {
        return done(new Error('이메일 정보를 가져올 수 없습니다.'), null);
      }

      const birth = birthyear && birthday
        ? new Date(`${birthyear}-${birthday.substring(0, 2)}-${birthday.substring(2, 4)}`)
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

      return done(null, {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        profileImageUrl: imageUrl,
      });
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
      const imageUrl = profile.photos?.[0]?.value;

      // Google People API를 사용하여 추가 정보 가져오기
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const people = google.people({ version: 'v1', auth: oauth2Client });
      const { data } = await people.people.get({
        resourceName: 'people/me',
        personFields: 'birthdays,genders',
      });

      // 생일 정보 처리
      let birth = null;
      if (data.birthdays && data.birthdays[0] && data.birthdays[0].date) {
        const { year, month, day } = data.birthdays[0].date;
        birth = new Date(year, month - 1, day);
      }

      // 성별 정보 처리
      let gender = null;
      if (data.genders && data.genders[0]) {
        gender = data.genders[0].value.toLowerCase();
      }
      
      let user = await repo.findByEmail(email);

      if (!user && email) {
        user = await repo.createUser({
          email,
          nickname,
          name,
          gender,
          birth,
          password: '',
          status: 'active'
        });
      } else if (user) {
        if (user.status === 'deactivated') {
          await repo.updateStatus(user.userId, 'active');
        }
        await repo.updateLastLogin(user.userId);
      }

      return done(null, {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        profileImageUrl: imageUrl,
      });
    } catch (error) {
      return done(error, null);
    }
  }
)); 