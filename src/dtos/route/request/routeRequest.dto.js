//루트 생성 요청 DTO 
export class CreateRouteDto {
    constructor({ routeName, description, places }) {
      this.routeName = routeName;
      this.description = description;
      this.places = places?.map((place) => ({
        sequence: place.sequence,
        isPrimaryPlace: place.isPrimaryPlace,
        lat: place.lat,
        lng: place.lng
      }));
    }
}

//루트 전체조회 요청 DTO 
export class RouteListQueryDto {
    constructor({ page = 1, limit = 10 }) {
      this.page = parseInt(page);
      this.limit = parseInt(limit);
    }
}

//루트 별점 주기 요청 DTO 
export class RateRouteDto {
    constructor({ rates }) {
      this.rates = rates;
    }
}

//루트 검색 요청 DTO 
export class RouteSearchQueryDto {
    constructor({ query }) {
      this.query = query;
    }
}

//루트 리뷰 생성 DTO
export class CreateReviewDto {
    constructor({ comment, rates }) {
      this.comment = comment;
      this.rates = rates;
    }
}


//루트 리뷰 조회 요청 DTO 
export class ReviewListQueryDto {
    constructor({ page = 1, limit = 10 }) {
      this.page = parseInt(page);
      this.limit = parseInt(limit);
    }
}

//루트 SNS 공유 링크 생성 DTO 
export class CreateShareLinkDto {
    constructor({ platform }) {
      this.platform = platform; // 예: 'kakao', 'facebook'
    }
}

