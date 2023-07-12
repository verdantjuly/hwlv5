const express = require("express");
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const likesRouter = require("./routes/likes.route");
const commentsRouter = require("./routes/comments.route");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", [usersRouter, postsRouter, likesRouter, commentsRouter]);
app.use(cookieParser());

app.listen(port, () => {
  console.log(port, "포트로 서버가 연결되었습니다.");
});
