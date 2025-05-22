import roadSearchService from "../../services/road/road.search.service.js"

export const roadSearch = async (res, req, next) => {

    try {
    
        const query = req.query.query; // 요청으로 들어온 쿼리 변수에 담기 

        if (!query) {
        throw new InvalidInputError('검색어(query)는 필수입니다.');
        } // 검색어 입력 안했을 때 처리  

    }catch(error){
        next(error); // 에러 핸들링 
    }


} // 루트 검색 컨트롤러  

