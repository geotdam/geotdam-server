// src/controllers/route/route.controller.js
import { getWalkingRouteByPlaceNames } from '../../services/route/route.service.js';

export const getWalkingRoute = async (req, res) => {
  try {
    const { originName, destinationName } = req.query;
    let waypointNames = req.query.waypointName;

    if (!originName || !destinationName) {
      return res.status(400).json({
        isSuccess: false,
        code: 'COMMON400',
        message: '잘못된 요청입니다.',
        result: '출발지(originName)와 목적지(destinationName)는 필수입니다.',
      });
    }

    if (typeof waypointNames === 'string') {
      waypointNames = [waypointNames];
    }

    const result = await getWalkingRouteByPlaceNames(originName, destinationName, waypointNames);

    console.log('✅ [Tmap 경로 응답 성공]');
    
    res.status(200).json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  } catch (error) {
    console.error('❌ [Tmap 경로 요청 실패]', error.message);
    const knownMessages = {
      NOT_FOUND: {
        message: '잘못된 요청입니다.',
        result: '출발지와 목적지 형식이 잘못되었습니다.',
      },
      SAME_LOCATION: {
        message: '잘못된 요청입니다.',
        result: '출발지와 목적지가 동일할 수 없습니다.',
      },
    };

    const type = error.code;
    if (knownMessages[type]) {
      return res.status(400).json({
        isSuccess: false,
        code: 'COMMON400',
        message: knownMessages[type].message,
        result: knownMessages[type].result,
      });
    }

    res.status(500).json({
      isSuccess: false,
      code: 'COMMON500',
      message: '서버 오류입니다.',
      result: error.message,
    });
  }
};
