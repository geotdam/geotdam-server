import {
  InvalidInputError,
  NotExistsError,
} from "../utils/errors/errors.js";
import axios from 'axios';
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
      return res.status(400).json({
        isSuccess: false,
        code: "COMMON4001",
        message: "현재 위치를 가져올 수 없습니다",
        result: null,
      });
    }

    const { latitude, longitude } = userLocation;

    const benches = await getNearbyBenches(latitude, longitude, 1000); // 반경 1km

    if (!benches || benches.length === 0) {
     throw new NotExistsError("반경 1km 이내에 벤치가 없습니다.");
    }

     return res.status(200).json(
      new OkSuccess(
        {
          benches,
        },
        "벤치 데이터 가져오기 성공"
      )
    );
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

    if (!benches || benches.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "COMMON404",
        message: "반경 1km 이내에 벤치가 없습니다.",
        result: null,
      });
    }

    // 각 벤치에 대해 reverse geocoding 수행 및 상세 정보 포함
    const enrichedBenches = await Promise.all(
      benches.map(async (bench) => {
        const { id, lat, lon, tags } = bench;
        let name = null;
        let address = null;

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

          const data = response.data;
          name = data.name || data.display_name || "장소명";
          address = data.display_name || "주소";
        } catch (e) {
          name = "장소명";
          address = "주소";
        }

        return {
          name,
          address,
          id,
          lat,
          lon,
          tags,
        };
      })
    );

    return res.status(200).json(
      new OkSuccess(
        {
         benches: enrichedBenches,
        },
        "가까운 벤치 데이터 가져오기 성공"
      )
    );
  } catch (error) {
    next(error);
  }
};
