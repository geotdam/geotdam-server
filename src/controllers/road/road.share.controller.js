import roadShareService from "../../services/road/road.share.service.js";
import { OkSuccess } from "../../utils/success/success.js";

export const createShareLink = async (req, res, next) => {
  try {
    const routeId = Number(req.params.routeId);//루트 아이디 연결 

    const result = await roadShareService.createShareLink(routeId);

    res.status(200).json(new OkSuccess(result, "공유 링크가 생성되었습니다."));
  } catch (error) {
    next(error);
  }
};
