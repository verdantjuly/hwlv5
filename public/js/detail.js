showpost();
showcomments();

// 게시글 조회
async function showpost() {
  const postId = localStorage.getItem('clickedpost');
  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  console.log(result.message);
  const post = `
  <div class = "post">
    <h1>${result.post[0].title}</h1>
    <p>닉네임 : ${result.post[0].nickname}</p>
    <p>작성일 : ${result.post[0].createdAt}</p>
    <p>좋아요 :  ${result.post[0].likesCount}</p>
    <p>내용 :  ${result.post[0].content}</p>
    <button onclick="openmodal(${postId})">수정</button>
    <button onclick = "deletepost(${postId})">삭제</button>
    <div class = "modal" id = modal${postId}>
        <div class = "modal-content">
            <label>제목</label>
                <input id = "editTitle"></input>
            <label>내용</label>
                <input id = "editContent"></input>
            <button onclick = "editpost()">수정</button>
            <button onclick = "closemodal(${postId})">X</button>
        </div>
    </div>
  </div>
  <div class = "writecomment">
      <input id = "commentContent"></input>
    <button onclick = "writecomment(${postId})">댓글 작성</button>
  </div>
    `;

  document.querySelector('body').insertAdjacentHTML('beforeend', post);
  return;
}

// 게시글 수정
async function editpost() {
  const postId = localStorage.getItem('clickedpost');
  const title = document.querySelector('#editTitle').value;
  const content = document.querySelector('#editContent').value;
  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: 'PATCH',
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

// 게시글 수정 모달 열기
function openmodal(postId) {
  const modal = document.querySelector(`#modal${postId}`);
  modal.style.display = 'block';
}

// 게시글 수정 모달 닫기
function closemodal(postId) {
  const modal = document.querySelector(`#modal${postId}`);
  modal.style.display = 'none';
}

// 게시글 삭제 (soft delete)
async function deletepost(postId) {
  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  console.log(result.message);
  window.location.href = 'http://localhost:3000/newsfeeds.html';
  return alert(result.message);
}

// 댓글

// 댓글 조회
async function showcomments() {
  const postId = localStorage.getItem('clickedpost');
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await response.json();
  console.log(result.message);
  const comments = result.comments
    .map(comment => {
      return `
      <div class = "comment">
        <p>닉네임 : ${comment.nickname}</p>
        <p>작성일 : ${comment.createdAt}</p>
        <p>댓글 내용 :  ${comment.content}</p>
        <button onclick="opencommentmodal(${comment.commentId})">수정</button>
        <button onclick = "deletecomment(${comment.commentId})">삭제</button>
        <div class = "modal" id = commentmodal${comment.commentId}>
            <div class = "modal-content">
                <label>내용</label>
                    <input id = "editCommentContent"></input>
                <button onclick = "editcomment(${comment.commentId})">수정</button>
                <button onclick = "closecommentmodal(${comment.commentId})">X</button>
            </div>
        </div>
      </div>
    
    `;
    })
    .join('');
  document.querySelector('body').insertAdjacentHTML('beforeend', comments);
  return;
}

// 댓글 수정 모달 열기
function opencommentmodal(commentId) {
  const modal = document.querySelector(`#commentmodal${commentId}`);
  modal.style.display = 'block';
}

// 댓글 수정 모달 닫기
function closecommentmodal(commentId) {
  const modal = document.querySelector(`#commentmodal${commentId}`);
  modal.style.display = 'none';
}

// 댓글 작성
async function writecomment(postId) {
  const content = document.querySelector('#commentContent').value;
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    },
  );
  const result = await response.json();
  console.log(result.message);
  window.location.reload();
  return alert(result.message);
}

// 댓글 수정
async function editcomment(commentId) {
  const postId = localStorage.getItem('clickedpost');
  const content = document.querySelector('#editCommentContent').value;
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments/${commentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    },
  );
  const result = await response.json();
  console.log(result.message);
  window.location.reload();
  return alert(result.message);
}

// 댓글 삭제
async function deletecomment(commentId) {
  const postId = localStorage.getItem('clickedpost');
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await response.json();
  console.log(result.message);
  window.location.href = 'http://localhost:3000/detail.html';
  return alert(result.message);
}
