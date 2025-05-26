import {
  InvalidInputError,
  NotExistsError,
} from "../utils/errors/errors.js";
import { OkSuccess } from "../utils/success/success.js"; 
import { latestLocations } from "../sockets/locationSocket.js";
import { getNearbyBenches } from "../services/marking/osm.service.js";

export const updateLocation = (req, res, next) => {
  const userId = req.user.userId;

  try {
    const { latitude, longitude } = req.body;

    if (!userId || latitude == null || longitude == null) {
      throw new InvalidInputError("모든 필드를 입력하세요.");
    }

    latestLocations[userId] = {
      latitude,
      longitude,
      timestamp: new Date(),
    };

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
};

export const getBenchLocation = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const userLocation = latestLocations[userId];
    if (!userLocation) {
      throw new NotExistsError("현재 위치 정보가 없습니다. 위치를 먼저 전송해주세요.");
    }

    const { latitude, longitude } = userLocation;

    const benches = await getNearbyBenches(latitude, longitude, 1000); // 반경 1km

    return res.status(200).json({
      isSuccess: true,
      code: "COMMON200",
      message: "성공입니다.",
      result: {
        benches,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNearbyBenchesByQuery = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      throw new InvalidInputError("lat, lon 쿼리 파라미터가 필요합니다.");
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // 실시간 위치 저장
    latestLocations[userId] = {
      latitude,
      longitude,
      timestamp: new Date(),
    };

    // 벤치 위치 조회
    const benches = await getNearbyBenches(latitude, longitude, 1000); // 반경 1km

    // 각 벤치에 대해 reverse geocoding 수행 (주소명 포함)
    const enrichedBenches = await Promise.all(
      benches.map(async (bench) => {
        const { lat, lon } = bench;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat,
                lon,
                format: "json",
              },
              headers: {
                "User-Agent": "BenchFinder/1.0",
              },
            }
          );

          return {
            lat,
            lon,
          };
        } catch (e) {
          return {
            lat,
            lon,
          };
        }
      })
    );

    return res.status(200).json({
      isSuccess: true,
      code: "COMMON200",
      message: "가까운 벤치 목록 조회 성공",
      result: enrichedBenches,
    });
  } catch (error) {
    next(error);
  }
};