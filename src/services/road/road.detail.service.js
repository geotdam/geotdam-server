import models from "../../models/index.js";

export const getRoadDetail = async (routeId, requesterId) => {
  const route = await models.Routes.findOne({
    where: { routeId },
    include: [
      {
        model: models.Users,
        attributes: ['nickname'],
        required: false
      },
      {
        model: models.RouteImgs,
        attributes: ['routeImgUrl'],
        required: false
      },
      {
        model: models.PlaceRoutes,
        include: [
          {
            model: models.Places,
            attributes: ['name', 'address', 'location', 'phone', 'open_hours']
          }
        ]
      }
    ]
  }); 

  if (!route) {
    throw new NotExistsError("유효하지 않은 루트입니다.");
  }

  return {
    routeId: route.routeId,
    name: route.name,
    description: route.description,
    creatorNickname: route.User?.nickname || null,
    avgRates: route.avgRates,
    createdAt: route.createdAt,
    routeImgUrl: route.RouteImgs?.[0]?.routeImgUrl || null,
    isOwner: requesterId === route.userId,
    places: route.PlaceRoutes
    .sort((a, b) => a.sequence - b.sequence)
    .map(pr => ({
      name: pr.Place.name,
      address: pr.Place.address,
      location: pr.Place.location,
      phone: pr.Place.phone,
      open_hours: pr.Place.open_hours,
      sequence: pr.sequence,
      isPrimaryPlace: pr.isPrimaryPlace
    }))
  };
};
