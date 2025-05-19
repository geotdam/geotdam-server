// src/controllers/maps/place.controller.js
import { searchPlacesFromTmap } from '../../services/maps/place.service.js';

export const searchPlaces = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        isSuccess: false,
        code: 'COMMON400',
        message: '검색어(query)는 필수입니다.',
        result: null,
      });
    }

    const result = await searchPlacesFromTmap(query);
    //console.log('🔍 요청 query:', req.query.query);  // <- 이거 추가!


    res.status(200).json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      code: 'COMMON500',
      message: '서버 오류입니다.',
      result: error.message,
    });
  }
};
