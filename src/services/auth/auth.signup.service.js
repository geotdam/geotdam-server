import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../../repositories/auth/auth.signup.repository.js";
import UserDto from "../../dtos/auth/auth.signup.dto.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async ({ email, password, name }) => {
  const exists = await userRepository.findByEmail(email);
  if (exists) throw new Error("이미 가입된 이메일입니다.");

  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    email,
    password: hashed,
    name,
  });

  return new UserDto({
    userId: user.userId,
    email: user.email,
    name: user.name,
  });
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  // 비밀번호 컬럼이 없으면 추가 필요
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  const token = jwt.sign(
    { userId: user.userId, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user: new UserDto({
      userId: user.userId,
      email: user.email,
      name: user.name,
    }),
  };
};
