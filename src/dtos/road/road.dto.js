class RoadDto {
  constructor({ routeId, userId, name, description, avgRates, places }) {
    this.routeId = routeId;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.avgRates = avgRates;
    this.places = places;
  }
}

export default RoadDto;
