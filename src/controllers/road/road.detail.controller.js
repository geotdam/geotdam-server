import * as roadService from "../../services/road/road.detail.service.js";
import { InvalidInputError, NotExistsError } from "../../utils/errors/errors.js";
import { OkSuccess } from "../../utils/success/success.js";

export const getRoadDetail = async (req, res, next) => {
  try {
    const routeId = Number(req.params.routeId, 10);
    if (isNaN(routeId)) {
      throw new InvalidInputError("유효하지 않은 routeId입니다.");
    }

    const requesterId = req.user?.userId;
    const results = await roadService.getRoadDetail(routeId, requesterId);

    if (!results) {
      throw new NotExistsError("유효하지 않은 루트입니다.");
    }

    return res.status(200).json(new OkSuccess(results));
  } catch (error) {
    next(error);
  }
};
