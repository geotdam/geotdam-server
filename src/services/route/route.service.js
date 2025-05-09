import axios from 'axios';
import { Sequelize } from 'sequelize';
import * as routeRepo from '../../repositories/route/route.repositories.js';
import { RouteCreatedDto } from '../../dtos/route/response/routeResponse.dto.js';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const createRoute = async (dto, userId) => {
  const { routeName, description, places: placeInputs } = dto;

  if (!placeInputs || placeInputs.length < 2) {
    throw new Error('최소 2개의 장소가 필요합니다.');
  }

  const origin = `${placeInputs[0].lat},${placeInputs[0].lng}`;
  const destination = `${placeInputs[placeInputs.length - 1].lat},${placeInputs[placeInputs.length - 1].lng}`;
  const waypoints = placeInputs.slice(1, -1).map(p => `${p.lat},${p.lng}`);

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=walking&key=${GOOGLE_API_KEY}${waypoints.length ? `&waypoints=${waypoints.join('|')}` : ''}`;

  const response = await axios.get(url);
  const data = response.data;

  if (!data.routes || data.routes.length === 0) {
    throw new Error('경로를 찾을 수 없습니다.');
  }

  const legs = data.routes[0].legs;
  const totalDistance = legs.reduce((sum, leg) => sum + leg.distance.value, 0);
  const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);

  // 1. 루트 저장
  const savedRoute = await routeRepo.createRoute({ userId, name: routeName, description });

  // 2. 장소 + 연결 테이블 저장
  await routeRepo.savePlaceRoutes(savedRoute.routeId, placeInputs);

  return new RouteCreatedDto({
    routeId: savedRoute.routeId,
    routeName,
    description,
    places: placeInputs,
    totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
    totalDuration: `${Math.round(totalDuration / 60)}분`,
  });
};
