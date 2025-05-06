class KakaoLoginDTO {
    constructor({ code }) {
      if (!code) throw new Error('code is required');
      this.code = code;
    }
  }
  
  module.exports = KakaoLoginDTO;
  