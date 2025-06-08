import { getMultiModalRoutes } from '../../services/route/route.service.js';
import { InvalidInputError } from '../../utils/errors/errors.js';
import { OkSuccess } from '../../utils/success/success.js';

export const getRoute = async (req, res, next) => {
  try {
    const { originName, destinationName } = req.query;
    let waypointNames = req.query.waypointName;

    if (!originName || !destinationName) {
      throw new InvalidInputError('출발지(originName)와 목적지(destinationName)는 필수입니다.');
    }

    if (typeof waypointNames === 'string') {
      waypointNames = [waypointNames];
    }

    const result = await getMultiModalRoutes(originName, destinationName, waypointNames);

    console.log('✅ [Tmap 다중 경로 응답 성공]');
    return res.status(200).json(new OkSuccess(result));
  } catch (error) {
    console.error('❌ [Tmap 다중 경로 요청 실패]', error.message);
    next(error); 
  }
};
