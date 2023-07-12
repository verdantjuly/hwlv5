const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const UsersController = require("../controllers/users.controller.js");
const usersController = new UsersController();

router.post("/signup", usersController.signupUser);
router.post("/login", usersController.loginUser);

module.exports = router;
