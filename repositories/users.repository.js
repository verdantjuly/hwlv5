const { Users } = require('../models');

class UserRepository {
  signupUser = async (nickname, password, refreshToken) => {
    const signupUserData = await Users.create({
      nickname,
      password,
      token: refreshToken,
    });
    return signupUserData;
  };

  loginUser = async nickname => {
    const founduserdata = await Users.findOne({ where: { nickname } });
    return founduserdata;
  };
  updateToken = async (nickname, refreshToken) => {
    const updated = await Users.update(
      { token: refreshToken },
      { where: { nickname } },
    );
    return updated;
  };
}

module.exports = UserRepository;
