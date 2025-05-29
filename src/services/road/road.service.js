import * as roadRepository from "../../repositories/road/road.repository.js";
import * as placeRepository from "../../repositories/road/road.place.repository.js";
import * as placeRouteRepository from "../../repositories/road/road.placeRoute.repository.js";
import * as reviewRepository from "../../repositories/road/road.review.repository.js";
import * as routeImgRepository from "../../repositories/road/road.img.repository.js";
import * as placeImgRepository from "../../repositories/place/place.img.repository.js";

import RoadDto from "../../dtos/road/road.dto.js";
import ReviewDto from "../../dtos/road/road.review.dto.js";
import { getPlaceImageUrl } from "../external/placeImage.service.js";

// 나만의 루트 생성(및 장소 저장)
export const newRoad = async ({
  // 로그인 한 해당 유저가 누구인지 미들웨어로 관리해야 합니당
  userId, // 미들웨어에서 추출하기~
  routeName, // 루트 이름
  description, // 루트 설명
  avgRates, // 평균 평점
  places, // 루트에 들어가는 장소들
  userUploadImgUrl // 유저가 업로드한 루트 대표 사진
}) => {
  if (!places || !Array.isArray(places) || places.length === 0) {
    throw new Error("장소 리스트 비어있음");
  }

  // 루트 생성
  const road = await roadRepository.create({
    userId,
    name: routeName,
    description,
    avgRates: avgRates || 0,
  });

  let firstPlace = null;

  // 장소 저장
  const placeCreates = places.map(async (place, index) => {

    // 중복 검사
    let placeRow = await placeRepository.findOneByNameAndAddress(place.name, place.address);

    // 없다면 새로 생성
    if (!placeRow) {
      placeRow = await placeRepository.create({
        name: place.name,
        phone: place.phone || "정보없음",
        open_hours: place.open_hours || "정보없음",
        address: place.address,
        location: {
          type: "Point",
          coordinates: [place.lng, place.lat],
        },
      });

      // 이미지 저장
      const placeImageUrl = await getPlaceImageUrl(place.name);
      if (placeImageUrl) {
        await placeImgRepository.create({
          placeId: placeRow.placeId,
          placeImgUrl: placeImageUrl,
        });
      }
    }

    if (index === 0) {
      firstPlace = placeRow;
    }

    await placeRouteRepository.create({
      routeId: road.routeId,
      placeId: placeRow.placeId,
      sequence: place.sequence,
      isPrimaryPlace: place.isPrimaryPlace
    });
  });

  await Promise.all(placeCreates);

  // 루트 대표 이미지 저장
  if (userUploadImgUrl) { // 유저가 저장한 이미지
    await routeImgRepository.create({
      routeId: road.routeId,
      routeImgUrl: userUploadImgUrl,
    });
  } else if (firstPlace) { // 업로드 된 이미지 없으면
    let imageUrl = null;

    // const existing = await placeImgRepository.findOneByPlaceId(firstPlace.placeId); // 첫 번째 장소
    imageUrl = await placeImgRepository.findOneByPlaceId(firstPlace.placeId);

    // if (existing?.placeImgUrl) {
    //   imageUrl = existing.placeImgUrl; // 장소 이미지
    // } else { // 장소 이미지도 없으면
    //   imageUrl = await getPlaceImageUrl(firstPlace.name); // 구글 api로 가져옴
    //   if (imageUrl) { // 구글에도 없을 수 있으니 체크
    //     await placeImgRepository.create({ // 장소 이미지 세팅
    //       placeId: firstPlace.placeId,
    //       placeImgUrl: imageUrl,
    //     });
    //   }
    // }

    if (imageUrl) { // 루트 이미지 세팅
      await routeImgRepository.create({
        routeId: road.routeId,
        routeImgUrl: imageUrl,
      });
    }

  }

  return new RoadDto(road);
};

// 루트 리뷰 생성
export const newReview = async ({ userId, routeId, comment, rates }) => {
  if (!userId || !routeId) throw new Error("필수 필드 누락");
  if (rates < 0 || rates > 5) throw new Error("평점 범위 오류(0~5)");

  const review = await reviewRepository.createReview({
    userId,
    routeId,
    comment,
    rates,
  });
  return new ReviewDto(review);
};

// 루트 리뷰 조회
export const getRoadReviews = async ({ routeId, limit = 10, offset = 0 }) => {
  // 파라미터 검증하기~
  if (!routeId) throw new Error("경로 ID 필수");
  if (limit < 0 || offset < 0) throw new Error("잘못된 페이지 번호");

  const { reviews, count } = await reviewRepository.findByRouteId({
    routeId,
    limit,
    offset,
  });

  // DTO 변환
  return {
    reviews: reviews.map((review) => new ReviewDto(review)),
    totalCount: count,
  };
};

// 루트 리뷰 수정
export const updateReview = async ({ reviewId, userId, comment, rates }) => {
  // 디버깅용 콘솔 로그
  // console.log("reviewId: " + reviewId);
  // console.log("userId: " + userId);

  if (!reviewId || !userId) throw new Error("필수 필드가 누락되었습니다.");
  if (rates !== undefined && (rates < 0 || rates > 5))
    throw new Error("평점은 0~5점까지 가능합니다.");

  // 리뷰 존재하는지 확인, 본인 수정인지 확인
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new Error("리뷰가 존재하지 않습니다.");
  if (review.userId !== userId) throw new Error("본인만 수정할 수 있습니다.");

  // 수정
  const update = await reviewRepository.updateReview({
    reviewId,
    comment,
    rates,
  });

  return new ReviewDto(update);
};
