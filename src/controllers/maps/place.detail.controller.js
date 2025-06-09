import { getPlaceDetailById } from '../../services/maps/place.detail.service.js';
import { OkSuccess } from '../../utils/success/success.js';

export const searchPlacesDetail = async (req, res, next) => {
  try {
    const { poiId } = req.params;
    const result = await getPlaceDetailById(poiId); 
    return res.status(200).json(new OkSuccess(result));
  } catch (err) {
    console.error('장소 상세 오류:', err);
    return res.status(500).json({ message: '장소 상세 정보를 가져오는 데 실패했습니다.' });
  }
};
