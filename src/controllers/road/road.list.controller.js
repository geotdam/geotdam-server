import * as roadListService from "../../services/road/road.list.service.js";
import { InvalidInputError, NotExistsError } from "../../utils/errors/errors.js";
import { OkSuccess } from "../../utils/success/success.js";

// 내가 만든 루트
export const getMyRoutes = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const results = await roadListService.getRoutesByOwner(userId, Number(page), Number(limit));
    return res.status(200).json(new OkSuccess(results));
  } catch (error) {
    next(error);
  }
};

// 특정 사용자의 루트
export const getUserRoutes = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new InvalidInputError("유효하지 않은 userId입니다.");
    } 
    const { page = 1, limit = 10 } = req.query;
    const results = await roadListService.getRoutesByUser(userId, Number(page), Number(limit));
    return res.status(200).json(new OkSuccess(results));
  } catch (error) {
    next(error);
  }
};

// 전체 루트 (무한스크롤)
export const getAllRoutes = async (req, res, next) => {
  try {
    const { cursor, limit = 10, sort = 'latest' } = req.query;
    const results = await roadListService.getAllRoutes({ cursor: Number(cursor), limit: Number(limit), sort });
    return res.status(200).json(new OkSuccess(results));
  } catch (error) {
    next(error);
  }
};
