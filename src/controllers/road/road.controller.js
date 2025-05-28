import * as roadService from "../../services/road/road.service.js";

// 나만의 루트 생성
export const newRoad = async (req, res) => {
  try {
    const road = await roadService.newRoad(req.body);
    res.status(201).json(road);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 루트 리뷰 생성
export const newReview = async (req, res) => {
  try {
    const review = await roadService.newReview({
      ...req.body,
      userId: req.user.userId, // JWT에서 가져오는거구여
      routeId: req.params.routeId, // URL 파라미터에서 가져왔구여 (근데 이거 왜 문자열로 받음....?? 그건 잘 모르겠듬)
    });
    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 루트 리뷰 조회 (페이징두 해야된대여)
export const listReview = async (req, res) => {
  try {
    const list = await roadService.getRoadReviews({
      routeId: req.params.routeId, // URL 파라미터에서 가져오기
      limit: parseInt(req.query.limit) || 10, // 쿼리 스트링 (일단 10으로..)
      offset: parseInt(req.query.offset) || 0,
    });
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 루트 리뷰 수정
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.userId; // JWT에서 가져오깅 (본인만 수정 가능하게)
    const { comment, rates } = req.body;

    // 디버깅용 콘솔 로그
    // console.log("reviewId: " + reviewId);
    // console.log("userId: " + userId);

    const update = await roadService.updateReview({
      reviewId,
      userId,
      comment,
      rates,
    });

    res.status(200).json(update);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
