export class RoadSearchDto{
  constructor(routeId, name, description, like_count, review_count, thumnail_url){
    this.routeId = routeId;
    this.name =name;
    this.description= description;
    this.like_count= like_count;
    this.review_count=review_count;
    this.thumnail_url = thumnail_url; 
}

}// 루트 검색 반환 dto 