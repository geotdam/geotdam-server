import roadSearchService from "../../services/road/road.search.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { OkSuccess } from "../../utils/success/success.js";

export const roadSearch = async (req, res, next) => {
  try {
    const query = req.query.query?.trim();
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 6;

    if (!query) {
      throw new InvalidInputError("검색어는 공백이거나 빈 문자열일 수 없습니다.");
    }

    const results = await roadSearchService.searchByKeyword(query, page, size);
    return res.status(200).json(new OkSuccess(results));
  } catch (error) {
    next(error);
  }
};
