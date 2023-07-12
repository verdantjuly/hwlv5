const UserService = require("../services/users.service");

class UsersController {
  userService = new UserService();

  signupUser = async (req, res) => {
    const { nickname, password, confirm } = req.body;
    const { status, cookie, message } = await this.userService.signupUser(
      nickname,
      password,
      confirm
    );

    if (cookie) {
      res.cookie(cookie.name, cookie.token, { expiresIn: cookie.expiresIn });
    }
    return res.status(status).json({ message });
  };

  loginUser = async (req, res) => {
    const { nickname, password } = req.body;
    const existRefreshToken = req.cookies.refreshToken;
    const { status, accesscookie, refreshcookie, message } =
      await this.userService.loginUser(nickname, password, existRefreshToken);
    if (accesscookie && refreshcookie) {
      res.cookie(accesscookie.name, accesscookie.token, {
        expiresIn: accesscookie.expiresIn,
      });
      res.cookie(refreshcookie.name, refreshcookie.token, {
        expiresIn: refreshcookie.expiresIn,
      });
    }
    return res.status(status).json({ message });
  };
}
module.exports = UsersController;
