const express = require("express");
const router = express.Router();

const authmiddleware = require("../middlewares/auth-middleware.js");
const LikesController = require("../controllers/likes.controller.js");
const likesController = new LikesController();

router.post("/posts/:postId/like", authmiddleware, likesController.liker);
router.get("/likes", authmiddleware, likesController.likeslist);

module.exports = router;
