class RoadDto {
  constructor({ routeId, userId, name, description, avgRates }) {
    this.routeId = routeId;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.avgRates = avgRates;
  }
}

export default RoadDto;
