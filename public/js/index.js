// 로그인 버튼에 걸어 줄 함수
// input : #loginNickname, #loginPassword
// button : login
async function login() {
  const password = document.querySelector('#loginPassword').value;
  const nickname = document.querySelector('#loginNickname').value;
  const response = await fetch(`http://localhost:3000/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname, password }),
  });
  const result = await response.json();
  console.log(result.message);
  if (response.status == 200 || response.status == 201) {
    socket.emit('LOGIN', {
      nickname,
    });
    location.href = 'http://localhost:3000/newsfeeds.html';
  }
  return alert(result.message);
}

// 회원가입 버튼에 걸어줄 함수
// input : #signupNickname, #signupPassword, #signupConfirm
// button : signup
async function signup() {
  const confirm = document.querySelector('#signupConfirm').value;
  const password = document.querySelector('#signupPassword').value;
  const nickname = document.querySelector('#signupNickname').value;
  const response = await fetch(`http://localhost:3000/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname, password, confirm }),
  });
  const result = await response.json();
  console.log(result.message);
  location.reload;
  return alert(result.message);
}
