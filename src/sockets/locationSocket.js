module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('📡 클라이언트 연결됨');
  
      socket.on('location', (data) => {
        console.log('📍 받은 위치 정보:', data);
        // TODO: DB 저장 또는 브로드캐스트 등 처리
      });
  
      socket.on('disconnect', () => {
        console.log('❌ 클라이언트 연결 종료됨');
      });
    });
  };
  