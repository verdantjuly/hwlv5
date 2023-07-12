const express = require("express");
const router = express.Router();

const authmiddleware = require("../middlewares/auth-middleware.js");
const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/posts", postsController.viewpostslist);
router.get("/posts/:postId", postsController.viewonepost);
router.post("/posts", authmiddleware, postsController.createPost);
router.patch("/posts/:postId", authmiddleware, postsController.editPost);
router.delete("/posts/:postId", authmiddleware, postsController.deletePost);

module.exports = router;
