const express = require('express');
const usersRouter = require('./routes/users.route');
const postsRouter = require('./routes/posts.route');
const likesRouter = require('./routes/likes.route');
const commentsRouter = require('./routes/comments.route');
const cookieParser = require('cookie-parser');
const { Server } = require('http');

const app = express();
const http = Server(app);

app.use(express.json());
app.use('/api', [usersRouter, postsRouter, likesRouter, commentsRouter]);
app.use(cookieParser());
app.use(express.static('public'));

module.exports = http;
