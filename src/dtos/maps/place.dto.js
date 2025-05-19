// src/dtos/maps/place.dto.js

//장소 반환용 
export class PlaceResponseDto {
  constructor(place) {
    this.place_name = place.name;
    this.place_id = place.place_id;

    // location 필드를 위도(lat), 경도(lng)로 분리
    const [lat, lng] = (place.location || "").split(",").map(parseFloat);
    this.lat = lat;
    this.lng = lng;

    this.address = place.address;
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
