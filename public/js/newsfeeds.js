listPosts();

async function writePost() {
  const title = document.querySelector('#writeTitle').value;
  const content = document.querySelector('#writeContent').value;
  const response = await fetch(`http://localhost:3000/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  const result = await response.json();
  console.log(result.message);
  window.location.reload();
  return alert(result.message);
}

async function listPosts() {
  const response = await fetch(`http://localhost:3000/api/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  console.log(result.message);
  const posts = result.allPost
    .map(post => {
      return `
      <div class = "post" onclick="clickpost(${post.postId})">
      <p>제목 :  ${post.title}</p>
    <p>닉네임 : ${post.nickname}</p>
    <p>작성일 : ${post.createdAt}</p>
    <p>좋아요 :  ${post.likesCount}</p>
    </div>`;
    })
    .join('');
  document.querySelector('body').insertAdjacentHTML('beforeend', posts);
  return;
}

function clickpost(postId) {
  localStorage.setItem('clickedpost', postId);
  location.href = 'http://localhost:3000/detail.html';
}
