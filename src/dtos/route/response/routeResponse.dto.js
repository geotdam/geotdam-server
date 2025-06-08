// src/dtos/route/response/routeResponse.dto.js

//경로 검색 리스폰스 dto 
export class RouteResponseDto {
  constructor(data, nameSummary, mode) {
    const features = data.features || [];

    const summary = features.find(f =>
      f.properties?.totalDistance !== undefined &&
      f.properties?.totalTime !== undefined
    )?.properties || { totalDistance: 0, totalTime: 0 };

    const polyline = features
      .filter((f) => f.geometry?.type === 'LineString')
      .flatMap((f) =>
        f.geometry.coordinates
          ?.filter(coord => Array.isArray(coord) && coord.length === 2)
          .map(([lng, lat]) => ({ lat, lng }))
      ) || [];

    const start = polyline[0] ?? {};
    const end = polyline.at(-1) ?? {};

    this.mode = mode;  // ✅ 고정값 'WALK' 제거하고 전달받은 mode 반영
    this.summary = nameSummary;
    this.distance = summary.totalDistance;
    this.duration = summary.totalTime;
    this.start_location = { latitude: start.lat, longitude: start.lng };
    this.end_location = { latitude: end.lat, longitude: end.lng };
    this.polyline = polyline;
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



