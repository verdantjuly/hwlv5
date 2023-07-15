const socketIo = require('socket.io');
const http = require('./app.js');

const io = socketIo(http);

io.on('connection', sock => {
  const { watchLogin, watchByeBye } = initSocket(sock);

  watchLogin();

  watchByeBye();
});

const socketIdMap = {};

function initSocket(sock) {
  socketIdMap[sock.id] = null;
  console.log(sock.id, '새로운 소켓이 연결됐어요!');

  // 특정 이벤트가 전달되었는지 감지할 때 사용될 함수
  function watchEvent(event, func) {
    sock.on(event, func);
  }

  // 연결된 모든 클라이언트에 데이터를 전달하는 함수
  function notifyEveryone(event, data) {
    sock.broadcast.emit(event, data);
  }

  return {
    watchLogin: () => {
      watchEvent('LOGIN', data => {
        const payload = {
          nickname: data.nickname,
          date: new Date().toISOString(),
        };

        console.log('로그인 기록', payload.nickname, payload.date);
        notifyEveryone('LOGIN_DATA', payload);
      });
    },

    watchByeBye: () => {
      watchEvent('disconnect', () => {
        delete socketIdMap[sock.id];
        console.log(sock.id, '연결이 끊어졌어요!');
      });
    },
  };
}
