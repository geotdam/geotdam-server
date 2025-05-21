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
    const review = await roadService.newReview(req.body);
    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// 루트 리뷰 조회
export const listReview = async (req, res) => {
  try {
    const list = await roadService.listReview(req.body);
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
