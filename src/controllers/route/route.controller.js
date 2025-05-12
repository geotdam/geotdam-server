import * as routeService from '../../services/route/route.service.js';

export const createRoute = async (req, res) => {
  console.log('✅ createRoute controller 실행됨');

  const userId = req.user.userId;
  const routeDto = req.body;

  const result = await routeService.createRoute(routeDto, userId);
  return res.status(201).json(result);
};
