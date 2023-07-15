const http = require('./app.js');
require('./socket.js'); // 이렇게 불러오기만 해도 소켓에 연결이 됩니다.
const port = 3000;

http.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
