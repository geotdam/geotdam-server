// src/dtos/route/response/routeResponse.dto.js

//도보경로 검색 리스폰스 dto 
export class RouteResponseDto {
  constructor(data, nameSummary) {
    const features = data.features || [];

    const summary = features.find(f =>
      f.properties?.totalDistance !== undefined &&
      f.properties?.totalTime !== undefined
    )?.properties || { totalDistance: 0, totalTime: 0 };

    const polyline = features
      .filter((f) => f.geometry?.type === 'LineString')
      .flatMap((f) =>
        f.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
      );

    const start = polyline[0] ?? {};
    const end = polyline.at(-1) ?? {};

    this.route = {
      summary: nameSummary,
      distance: summary.totalDistance,
      duration: summary.totalTime,
      start_location: start,
      end_location: end,
      polyline,
    };

    this.markings = [];
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



