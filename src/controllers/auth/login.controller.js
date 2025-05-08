import models from "../../models/index.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;

  // 사용자 인증 (예: DB에서 유저 조회)
  const user = await models.users.findOne({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // JWT 발급
  const token = jwt.sign(
    { userId: user.id, email: user.email }, // payload
    process.env.JWT_SECRET, // 비밀키
    { expiresIn: "1h" } // 옵션: 만료시간
  );

  return res.json({ token });
};
