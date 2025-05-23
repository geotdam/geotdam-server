export class RoadSearchDto {
  constructor({ route_id, name, description, routeImgs, dataValues }) {
    this.routeId = route_id;
    this.name = name;
    this.description = description;
    this.thumbnail_url = routeImgs?.[0]?.routeImgUrl || null;
    this.review_count = Number(dataValues?.review_count) || 0;
    this.like_count = Number(dataValues?.like_count) || 0;
  }
}


export class RoadSearchResponseDto {
  constructor({ totalCount, page, size, roads }) {
    this.totalCount = totalCount;
    this.page = page;
    this.size = size;
    this.roads = roads;
  }
}
