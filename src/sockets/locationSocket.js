let latestLocations = {}; // 사용자 위치 저장

const locationSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('new client connected', socket.id);

    // 위치 수신
    socket.on('location', (data) => {
      const { userId, latitude, longitude } = data;
      console.log('📍 받은 위치 정보:', data);

      if (userId && latitude && longitude) {
        latestLocations[userId] = {
          latitude,
          longitude,
          timestamp: new Date(),
        };
      }
    });

    socket.on('disconnect', () => {
      console.log('client connection over');
    });
  });
};

export { latestLocations }; // 외부에서 사용 가능하게 export
export default locationSocket;
