// src/dtos/maps/place.dto.js

//장소 반환용 
export class PlaceResponseDto {
  constructor(place) {
    this.place_name = place.name;
    this.place_id = place.place_id;

    const [lat, lng] = (place.location || "").split(",").map(parseFloat);
    this.lat = lat;
    this.lng = lng;

    this.address = place.address;
    this.thumbnail_url = place.thumbnail_url ?? null;//이미지 url 

    this.tel = place.tel ?? null;   // 전화번호 
    this.additionalInfo = place.additionalInfo ?? null; // 상세정보 
    this.point = place.point ?? null; // 별점 점수 
    this.participant = place.participant ?? null;// 별점 참여자 수 
    this.jibunAddress = place.jibunAddress ?? null;       // 지번 주소
    this.roadAddress = place.roadAddress ?? null;         // 도로명 주소
    this.bizCategory = place.bizCategory ?? null;         // 업종
    this.menuInfo = place.menuInfo ?? null;               // 판매 메뉴
    this.franchise = place.franchise ?? null;             // 가맹점 여부
    this.facilities = place.facilities ?? null;           // 부대시설 정보 (ex: 충전소 등)
  }
}

//장소 별점 정보 DTO 
export class PlaceRatingResponseDto {
  constructor(place) {
    const data = place.dataValues; // 직접 꺼냄
    this.place_id = data.placeId;
    this.place_name = data.name;
  }
}

// 장소 등록용 DTO
export class CreatePlaceDto {
  constructor({ name, description, location, address, sequence }) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.address = address;
    this.sequence = sequence;
  }
}

//장소 리뷰 응답 DTO 
export class PlaceReviewResponseDto {
  constructor(placeReview, correctedRating) {
    const data = placeReview.dataValues;

    this.review_id = data.reviewId;
    this.user_id = data.userId;
    this.place_id = data.placeId;
    this.rating = data.rating;
    this.content = data.content;
    this.created_at = data.createdAt;
    this.updated_at = data.updatedAt;
    this.corrected_rating = correctedRating
    this.user = {
      nickname: data.User?.nickname || '알 수 없음',
      profile_image: data.User?.UserImg?.imageUrl || null,
    };
  }
}



// 장소 이미지 등록 DTO
export class CreatePlaceImageDto {
  constructor({ place_id, place_img_url }) {
    this.place_id = place_id;
    this.place_img_url = place_img_url;
  }
}

// 경로에 포함된 장소 등록 DTO
export class CreatePlaceRouteDto {
  constructor({ route_id, place_id, is_primary_place }) {
    this.route_id = route_id;
    this.place_id = place_id;
    this.is_primary_place = is_primary_place;
  }
}

// 경로 검색 
export class PlaceQueryDto {
  constructor(query) {
    if (!query || typeof query !== 'string') {
      throw new Error("검색어(query)는 문자열로 전달되어야 합니다.");
    }
    this.query = query;
  }
}
