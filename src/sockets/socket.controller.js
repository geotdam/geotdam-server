import {
  InvalidInputError,
  NotExistsError,
} from "../utils/errors/errors.js";
import { OkSuccess } from "../utils/success/success.js"; 

//위치 캐시용
let latestLocations = {};

export const updateLocation = (req,res, next) => {
    const userId = req.user.userId; 
  console.log("req.user:", req.user); 
    try{
    const {latitude, longitude} = req.body; 
  console.log("latitude, longitude:", latitude, longitude);
    if (!userId || !latitude || !longitude) {  //유효성 검사
        throw new InvalidInputError("모든 필드를 입력하세요.");
    }

    latestLocations[userId] = {
        latitude,
        longitude,
        timestamp: new Date(),
    }
// 응답에 위치 정보 포함
    return res.status(200).json(
      new OkSuccess(
        {
          userId,
          latitude,
          longitude,
        },
        "위치 업데이트 성공"
      )
    );
  } catch (error) {
    next(error);
  }
}

export const getBenchLocation = (req,res, next) => {
    const userId = req.user.id; 
      return res.status(200).json({
    isSuccess: true,
    code: "COMMON200",
    message: "성공입니다.",
    result: {
      benches: []
    }
  });
}
