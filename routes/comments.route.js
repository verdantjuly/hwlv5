const express = require("express");
const router = express.Router();

const authmiddleware = require("../middlewares/auth-middleware.js");
const CommentsController = require("../controllers/comments.controller.js");
const commentsController = new CommentsController();

router.get("/posts/:postId/comments", commentsController.viewcomments);
router.post(
  "/posts/:postId/comments",
  authmiddleware,
  commentsController.createcomments
);
router.patch(
  "/posts/:postId/comments/:commentId",
  authmiddleware,
  commentsController.editcomment
);
router.delete(
  "/posts/:postid/comments/:commentId",
  authmiddleware,
  commentsController.deletecomment
);

module.exports = router;
