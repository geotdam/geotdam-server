class ReviewDto {
  constructor({ reviewId, routeId, userId, comment, rates }) {
    this.reviewId = reviewId;
    this.routeId = routeId;
    this.userId = userId;
    this.comment = comment;
    this.rates = rates;
  }
}

export default ReviewDto;
