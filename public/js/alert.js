// 소켓을 이용해 받은 정보를 알림 띄운다.

const socket = io.connect('/');

socket.on('LOGIN_DATA', function (data) {
  const { nickname, date } = data;
  loginNotification(nickname, date);
});

function loginNotification(targetNickname, date) {
  const messageHtml = `${targetNickname}님이 방금 접속하였습니다. <br /><small>(${date})</small>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">X</button>`;
  const alt = document.querySelector('#customerAlert');
  if (alt) {
    alt.html(messageHtml);
  } else {
    const htmlTemp = `<div class="alert alert-warning alert-dismissible fade show" role="alert">${messageHtml}</div>`;
    document.querySelector('body').insertAdjacentHTML('beforeend', htmlTemp);
  }
}
