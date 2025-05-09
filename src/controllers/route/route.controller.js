import * as routeService from '../../services/route/route.service.js';
import { CreateRouteDto } from '../../dtos/route/request/routeRequest.dto.js';

export const createRoute = async (req, res, next) => {
  try {
    const dto = new CreateRouteDto(req.body);
    const userId = req.user.userId;

    const result = await routeService.createRoute(dto, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
