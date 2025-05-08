//루트 리뷰 생성 요청 DTO
export class CreateReviewDto {
    constructor({ comment, rates }) {
      this.comment = comment;
      this.rates = rates;
    }
  }


//루트 검색 응답 DTO 
export class RouteSearchResultDto {
    constructor({ routeId, name, description, avgRates, thumbnailUrl }) {
      this.routeId = routeId;
      this.name = name;
      this.description = description;
      this.avgRates = avgRates;
      this.thumbnailUrl = thumbnailUrl;
    }
  }
  

//루트 리뷰 응답 DTO
  export class RouteReviewDto {
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


//추천 루트 보여주기 DTO 
export class RecommendedRouteDto {
    constructor({ routeId, name, avgRates, reason }) {
      this.routeId = routeId;
      this.name = name;
      this.avgRates = avgRates;
      this.reason = reason; 
    }

}



