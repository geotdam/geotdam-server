import { RoadSearchDto, RoadSearchResponseDto } from "../../dtos/road/road.search.dto.js";
import { findRoadByKeyword } from "../../repositories/road/road.search.repository.js";

const roadSearchService = {
  searchByKeyword: async (query, page = 1, size = 6) => {
    const offset = (page - 1) * size;
    const { rows, count } = await findRoadByKeyword(query, offset, size);

    const roads = rows.map(route => new RoadSearchDto(route));

    return new RoadSearchResponseDto({
      totalCount: typeof count === 'number' ? count : count.length,
      page,
      size,
      roads,
    });
  }
};

export default roadSearchService;
