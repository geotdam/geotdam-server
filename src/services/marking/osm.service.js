import axios from 'axios';

export const getNearbyBenches = async (latitude, longitude, radius = 1000) => {
  const query = `[out:json];node["amenity"="bench"](around:${radius},${latitude},${longitude});out;`;
  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await axios.get(url, {
      params: { data: query },
    });
    return response.data.elements; // 벤치 목록
  } catch (error) {
    console.error('Overpass API 요청 오류:', error.message);
    throw error;
  }
};

export const getNearbyStreetLamps = async (latitude, longitude, radius = 8000) => {
  const query = `[out:json];node["highway"="street_lamp"](around:${radius},${latitude},${longitude});out;`;
  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await axios.get(url, {
      params: { data: query },
    });
    return response.data.elements; // 가로등 목록
  } catch (error) {
    console.error('Overpass API 요청 오류:', error.message);
    throw error;
  }
};