export class RoadSearchDto {
  constructor({ route_id, name, description, images, reviews, likes }) {
    this.routeId = route_id;
    this.name = name;
    this.description = description;

    // 대표 이미지 1개 추출
    this.thumbnail_url = images?.[0]?.routeImgUrl || null;

    // 리뷰 수, 좋아요 수 계산
    this.review_count = reviews?.length || 0;
    this.like_count = likes?.length || 0;
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
