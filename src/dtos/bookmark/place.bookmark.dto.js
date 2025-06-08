export class PlaceBookmarkDto {
  constructor({ place_bookmark_id, user_id, place_id, created_at }) {
    this.placeBookmarkId = place_bookmark_id;
    this.userId = user_id;
    this.placeId = place_id;
    this.createdAt = created_at;
  }
}
