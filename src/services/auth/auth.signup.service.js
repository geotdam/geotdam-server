import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../../repositories/auth/auth.signup.repository.js";
import UserDto from "../../dtos/auth/auth.signup.dto.js";

const JWT_SECRET = process.env.JWT_SECRET;

// userId, name, nickname, birth, gender, address, email 포함되어야 할 내용들
export const register = async ({
  email,
  password,
  name,
  nickname,
  birth,
  gender,
  address,
}) => {
  const exists = await userRepository.findByEmail(email);
  if (exists) throw new Error("이미 가입된 이메일입니다.");

  const hashed = await bcrypt.hash(password, 10); // 비밀번호 암호화
  console.log("Hashed Password:", hashed); // 해시값 확인

  const user = await userRepository.createUser({
    email,
    password: hashed,
    name,
    nickname,
    birth,
    gender,
    address,
    status: "active", // 일단 가입하는 사람 active로 초기화
  });

  // return new UserDto({
  //   userId: user.userId,
  //   email: user.email,
  //   name: user.name,
  //   nickname: user.nickname,
  //   birth: user.birth,
  //   gender: user.gender,
  //   address: user.address,
  // });

  return {
    user: new UserDto({
      userId: user.userId,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      birth: user.birth,
      gender: user.gender,
      address: user.address,
    }),
  };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  // 비밀번호 컬럼이 없으면 추가 필요
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  // JWT 토큰 생성
  const token = jwt.sign(
    { userId: user.userId, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" } // 1시간마다 재생성해야됩니당
  );

  // jwt 토큰 db에 저장
  await userRepository.saveJwtToken({
    userId: user.userId,
    jwtToken: token,
  });
  console.log("Generated Token:", token); // 토큰 값 확인

  return {
    token, // 토큰 반환
    user: new UserDto({
      userId: user.userId,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      birth: user.birth,
      gender: user.gender,
      address: user.address,
    }),
  };
};
