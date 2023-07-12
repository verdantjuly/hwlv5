const { Users } = require("../models");

class UserRepository {
  signupUser = async (nickname, password, refreshToken) => {
    const signupUserData = await Users.create({
      nickname,
      password,
      token: refreshToken,
    });
    return signupUserData;
  };
  loginUser = async (nickname, refreshToken) => {
    const loginUserData = await Users.update(
      { token: refreshToken },
      { where: { nickname } }
    );
    return loginUserData;
  };
}

module.exports = UserRepository;
