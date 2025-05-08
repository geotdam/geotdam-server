//루트 상세 조회회 응답 DTO
export class RouteDetailDto {
    constructor({ routeId, user, name, description, avgRates, places, routeImgs, isLiked, isBookmarked }) {
      this.routeId = routeId;
      this.user = user; // { userId, name, profileImgUrl }
      this.name = name;
      this.description = description;
      this.avgRates = avgRates;
      this.places = places; // [{ placeId, name, location, placeImgUrl }]
      this.routeImgs = routeImgs; // [{ routeImgId, url }]
      this.isLiked = isLiked;
      this.isBookmarked = isBookmarked;
    }
  }


// 루트 전체 조회 응답 DTO 
export class RouteSummaryDto {
    constructor({ routeId, name, avgRates, thumbnailUrl }) {
      this.routeId = routeId;
      this.name = name;
      this.avgRates = avgRates;
      this.thumbnailUrl = thumbnailUrl;
    }
}

//루트 리뷰 조회 응답 DTO 
export class ReviewDto {
    constructor({ reviewId, user, comment, rates, createdAt }) {
      this.reviewId = reviewId;
      this.user = user; // { userId, name, profileImgUrl }
      this.comment = comment;
      this.rates = rates;
      this.createdAt = createdAt;
    }
}

//내가 만든 경로의 마킹 불러오기 DTO 
export class RouteMarkingDto {
    constructor({ markingId, lat, lng, description }) {
      this.markingId = markingId;
      this.lat = lat;
      this.lng = lng;
      this.description = description;
    }
  }


//추천 루트 보여주기 응답 DTO 
export class RecommendedRouteDto {
    constructor({ routeId, name, avgRates, reason }) {
      this.routeId = routeId;
      this.name = name;
      this.avgRates = avgRates;
      this.reason = reason; 
    }
  }
  

