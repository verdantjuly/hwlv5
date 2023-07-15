const JWT = require('jsonwebtoken');
const secretkey = 'ACCESS_TOKEN';
require('../config/env');

module.exports = async (req, res, next) => {
  const { accessToken } = req.cookies;
  const [authType, authToken] = (accessToken ?? '').split(' ');
  try {
    if (!authToken || authType !== 'Bearer') {
      return res.status(400).json({
        message: '로그인 후 이용 가능한 기능입니다.',
      });
    }

    const verified = JWT.verify(authToken, secretkey);

    if (!verified) {
      return res.status(400).json({
        message: '로그인 후 이용 가능한 기능입니다.',
      });
    } else {
      res.locals.userId = verified.userId;
      next();
    }
  } catch (err) {
    return res.status(400).json({
      message: '로그인 후에 이용하세요.',
    });
  }
};
