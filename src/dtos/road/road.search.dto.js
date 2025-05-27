export class RoadSearchDto {
  constructor({ routeId, name, description, like_count, review_count, thumbnail_url }) {
    this.routeId = routeId;
    this.name = name;
    this.description = description;
    this.like_count = like_count;
    this.review_count = review_count;
    this.thumbnail_url = thumbnail_url;
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
