import {
  findRoadByKeyword,
  getThumbnailByRouteId
} from "../../repositories/road/road.search.repository.js";
import { RoadSearchDto, RoadSearchResponseDto } from "../../dtos/road/road.search.dto.js";

export const roadSearchService = {
  searchByKeyword: async (query, page = 1, size = 6) => {
    const offset = (page - 1) * size;

    const { rows, count } = await findRoadByKeyword(query, offset, size);

    // 각 루트마다 썸네일을 별도 쿼리로 가져옴
    const roads = [];

    for (const row of rows) {
       const routeId = row.get("routeId") ?? row.route_id; // 안전하게 fall-back

      //console.log("routeId:", routeId); 
      
      const thumbnail_url = await getThumbnailByRouteId(row.get("routeId"));
      //console.log("routeId:", routeId);
      //console.log("썸네일 URL:", thumbnail_url);

      roads.push(new RoadSearchDto({
        routeId: row.get("routeId"),
        name: row.name,
        description: row.description,
        like_count: Number(row.get("like_count") || 0),
        review_count: Number(row.get("review_count") || 0),
        thumbnail_url
      }));
    }

    return new RoadSearchResponseDto({
      totalCount: Array.isArray(count) ? count.length : count,
      page,
      size,
      roads
    });
  }
};
