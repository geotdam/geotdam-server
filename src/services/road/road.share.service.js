import { RoadShareDto } from "../../dtos/road/road.share.dto.js";
import { findRouteById } from "../../repositories/road/road.share.repository.js";

const BASE_SHARE_URL = "https://walkmate.site/share/routes";

const roadShareService = {
  createShareLink: async (routeId) => {
    const route = await findRouteById(routeId);

    if (!route) {
      const error = new Error("존재하지 않는 루트입니다.");
      error.status = 404;
      error.code = "ROUTE404";
      throw error;
    }

    const shareUrl = `${BASE_SHARE_URL}/${routeId}`;
    return new RoadShareDto({ route_id: routeId, share_url: shareUrl });
  }
};

export default roadShareService;
