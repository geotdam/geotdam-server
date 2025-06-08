// src/dtos/route/response/routeResponse.dto.js

//경로 검색 리스폰스 dto 
export class RouteResponseDto {
  constructor(data, nameSummary, mode) {
    this.mode = mode;
    this.summary = nameSummary;
    this.distance = 0;
    this.duration = 0;
    this.polyline = [];
    this.start_location = {};
    this.end_location = {};

    // ✅ 대중교통 응답 처리
    if (mode === 'TRANSIT' && data.metaData?.plan?.itineraries?.length > 0) {
      const itinerary = data.metaData.plan.itineraries[0];
      this.distance = itinerary.totalDistance;
      this.duration = itinerary.totalTime;

      const polyline = [];

      itinerary.legs.forEach((leg) => {
        if (leg.steps) {
          leg.steps.forEach((step) => {
            if (step.linestring) {
              const coords = step.linestring
                .split(' ')
                .map(pair => {
                  const [lng, lat] = pair.split(',').map(Number);
                  return { lat, lng };
                });
              polyline.push(...coords);
            }
          });
        }
      });

      this.polyline = polyline;
      const start = polyline[0] ?? {};
      const end = polyline.at(-1) ?? {};
      this.start_location = { latitude: start.lat, longitude: start.lng };
      this.end_location = { latitude: end.lat, longitude: end.lng };

    // ✅ 도보 및 자동차 응답 처리
    } else if (data.features?.length > 0) {
      const features = data.features;

      const summary = features.find(f =>
        f.properties?.totalDistance !== undefined &&
        f.properties?.totalTime !== undefined
      )?.properties || { totalDistance: 0, totalTime: 0 };

      this.distance = summary.totalDistance;
      this.duration = summary.totalTime;

      const rawPolyline = features
        .filter((f) => f.geometry?.type === 'LineString')
        .flatMap((f) =>
          f.geometry.coordinates
            ?.filter(coord => Array.isArray(coord) && coord.length === 2)
            .map(([lng, lat]) => ({ lat, lng }))
        ) || [];

      const polyline = rawPolyline.filter((_, idx) => idx % 5 === 0);

      this.polyline = polyline;
      const start = polyline[0] ?? {};
      const end = polyline.at(-1) ?? {};
      this.start_location = { latitude: start.lat, longitude: start.lng };
      this.end_location = { latitude: end.lat, longitude: end.lng };
    }
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



