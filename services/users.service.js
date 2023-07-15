const UserRepository = require('../repositories/users.repository');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const secretkey = 'ACCESS_TOKEN';
const rsecretkey = 'REFRESH_TOKEN';
require('../config/env');

class UserService {
  userRepository = new UserRepository();
  signupUser = async (nickname, password, confirm) => {
    const idcheck = /^[0-9a-z]{3,}$/gi;

    try {
      if (!nickname || !password || !confirm) {
        return {
          status: 400,
          cookie: null,
          message: '미입력된 항목이 있습니다. 모두 입력하여 주세요.',
        };
      } else if (!idcheck.test(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            '닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성해 주세요.',
        };
      } else if (password.length < 4 || password.includes(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            '비밀번호는 최소 4자 이상, 닉네임과 같은 값이 포함될 수 없습니다.',
        };
      } else if (password !== confirm) {
        return {
          status: 400,
          cookie: null,
          message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        };
      }
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashedPassword = await bcrypt.hash(password, salt);

      const refreshToken = JWT.sign({}, rsecretkey, {
        expiresIn: '7d',
      });

      const token = `Bearer ${refreshToken}`;
      await this.userRepository.signupUser(
        nickname,
        hashedPassword,
        refreshToken,
      );

      return {
        status: 201,
        cookie: {
          name: 'refreshToken',
          token,
          expiresIn: '7d',
        },
        message: '회원 가입에 성공하였습니다.',
      };
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return {
          status: 400,
          cookie: null,
          message: '중복된 닉네임입니다.',
        };
      } else {
        return {
          status: 400,
          cookie: null,
          message: '회원 가입에 실패했습니다.',
        };
      }
    }
  };

  loginUser = async (nickname, password, existRefreshToken) => {
    const founduserdata = await this.userRepository.loginUser(nickname);
    const userId = founduserdata.userId;
    const [authType, authToken] = (existRefreshToken ?? '').split(' ');
    const accessToken = JWT.sign({ userId }, secretkey, {
      expiresIn: '7d',
    });
    const refreshToken = JWT.sign({}, rsecretkey, {
      expiresIn: '7d',
    });
    class Returns {
      constructor() {}

      status201() {
        return {
          status: 201,
          accesscookie: {
            name: 'accessToken',
            token: `Bearer ${accessToken}`,
            expiresIn: 3600,
          },
          refreshcookie: {
            name: 'refreshToken',
            token: `Bearer ${refreshToken}`,
            expiresIn: '7d',
          },
          message: '로그인에 성공하였습니다.',
        };
      }

      status400() {
        return {
          status: 400,
          accesscookie: null,
          refreshcookie: null,
          message: '로그인에 실패하였습니다.',
        };
      }

      status200() {
        return {
          status: 200,
          accesscookie: {
            name: 'accessToken',
            token: `Bearer ${accessToken}`,
            expiresIn: 3600,
          },
          refreshcookie: {
            name: 'refreshToken',
            token: `Bearer ${authToken}`,
            expiresIn: '7days',
          },
          message: '로그인에 성공하였습니다.',
        };
      }
    }

    const status = new Returns();
    try {
      if (!nickname || !password) {
        return status.status400();
      }
      const match = await bcrypt.compare(password, founduserdata.password);
      if (!founduserdata.nickname || !match) {
        return status.status400();
      } else if (existRefreshToken) {
        const verified = JWT.verify(authToken, rsecretkey);
        if (authType !== 'Bearer' || !authToken) {
          return status.status400();
        } else if (
          (founduserdata.token == authToken && !verified) ||
          (founduserdata.token !== authToken && verified)
        ) {
          await this.userRepository.updateToken(nickname, refreshToken);
          return status.status201();
        } else if (founduserdata.token !== authToken && !verified) {
          res.clearCookie('refreshToken');
          res.clearCookie('accessToken');
          console.log(`비정상적인 접근 userId:${userId}`);
          return status.status400();
        }
        if (founduserdata.token == authToken && verified) {
          return status.status200();
        }
      } else if (!existRefreshToken) {
        await this.userRepository.updateToken(nickname, refreshToken);
        return status.status201();
      }
    } catch (err) {
      console.log(err);
      return status.status400();
    }
  };
}

module.exports = UserService;
