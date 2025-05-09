import db from '../../models/index.js';
const { places, routes, placeRoutes } = db;
import { Sequelize } from 'sequelize';

export const createRoute = async ({ userId, name, description }) => {
  return await routes.create({
    userId,
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const savePlaceRoutes = async (routeId, placeInputs) => {
  for (const place of placeInputs) {
    const point = Sequelize.fn('ST_PointFromText', `POINT(${place.lng} ${place.lat})`);

    let placeRow = await places.findOne({
      where: Sequelize.where(
        Sequelize.fn('ST_AsText', Sequelize.col('location')),
        '=',
        Sequelize.fn('ST_AsText', point)
      )
    });

    if (!placeRow) {
      placeRow = await places.create({
        name: '사용자 장소',
        location: point,
        address: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await placeRoutes.create({
      routeId,
      placeId: placeRow.placeId,
      sequence: place.sequence,
      isPrimaryPlace: place.isPrimaryPlace
    });
  }
};
