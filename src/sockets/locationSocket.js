const locationSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('new client connected',socket.id);
    
    //클라이언트에게 위치 수신 받음
    socket.on('location', (data) => {
      console.log('📍 받은 위치 정보:', data);
    });
    
    socket.on('disconnect', () => {
      console.log('client connection over');
    });
  });
};

export default locationSocket;
