import models from "../../models/index.js";

// 나만의 루트 생성
export const create = async ({ userId, name, description, avgRates }) => {
  try {
    const newRoute = await models.Routes.create({
      userId,
      name,
      description,
      avgRates,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newRoute;
  } catch (error) {
    throw error;
  }
};

