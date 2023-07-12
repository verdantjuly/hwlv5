const UserRepository = require("../repositories/users.repository");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secretkey = "";
const rsecretkey = "";
const { Users } = require("../models");

class UserService {
  userRepository = new UserRepository();
  signupUser = async (nickname, password, confirm) => {
    const idcheck = /^[0-9a-z]{3,}$/gi;

    try {
      if (!nickname || !password || !confirm) {
        return {
          status: 400,
          cookie: null,
          message: "미입력된 항목이 있습니다. 모두 입력하여 주세요.",
        };
      } else if (!idcheck.test(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성해 주세요.",
        };
      } else if (password.length < 4 || password.includes(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            "비밀번호는 최소 4자 이상, 닉네임과 같은 값이 포함될 수 없습니다.",
        };
      } else if (password !== confirm) {
        return {
          status: 400,
          cookie: null,
          message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        };
      }
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashedPassword = await bcrypt.hash(password, salt);

      const refreshToken = JWT.sign({}, rsecretkey, {
        expiresIn: "7d",
      });

      await this.userRepository.signupUser(
        nickname,
        hashedPassword,
        refreshToken
      );

      return {
        status: 201,
        cookie: {
          name: "refreshToken",
          token: `Bearer ${refreshToken}`,
          expiresIn: "7d",
        },
        message: "회원 가입에 성공하였습니다.",
      };
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return {
          status: 400,
          cookie: null,
          message: "중복된 닉네임입니다.",
        };
      }
    }
  };

  loginUser = async (nickname, password, existRefreshToken) => {
    if (!nickname || !password) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
    }
    const target = await Users.findOne({ where: { nickname } });
    if (!target) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
    }
    const match = await bcrypt.compare(password, target.password);
    if (!match) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
    } else {
      const [authType, authToken] = (existRefreshToken ?? "").split(" ");
      const userId = target.userId;
      if (target.token == authToken && JWT.verify(authToken, rsecretkey)) {
        const accessToken = JWT.sign({ userId }, secretkey, {
          expiresIn: 3600,
        });
        return {
          status: 200,
          accesscookie: {
            name: "accessToken",
            token: `Bearer ${accessToken}`,
            expiresIn: 3600,
          },
          refreshcookie: {
            name: "refreshToken",
            token: `Bearer ${existRefreshToken}`,
            expiresIn: "7d",
          },
          message: "로그인에 성공하였습니다.",
        };
      } else if (
        (target.token == authToken && !JWT.verify(authToken, rsecretkey)) ||
        !existRefreshToken ||
        (target.token !== authToken && JWT.verify(authToken, rsecretkey))
      ) {
        const refreshToken = JWT.sign({}, rsecretkey, {
          expiresIn: "7d",
        });
        const accessToken = JWT.sign({ userId }, secretkey, {
          expiresIn: 3600,
        });
        await this.userRepository.loginUser(nickname, refreshToken);
        return {
          status: 201,
          accesscookie: {
            name: "accessToken",
            token: `Bearer ${accessToken}`,
            expiresIn: "1h",
          },
          refreshcookie: {
            name: "refreshToken",
            token: `Bearer ${refreshToken}`,
            expiresIn: "7d",
          },
          message: "로그인에 성공하였습니다.",
        };
      } else if (
        target.token !== authToken &&
        !JWT.verify(authToken, rsecretkey)
      ) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        console.log(`비정상적인 접근 userId:${userId}`);
        return res.status(400).json({ message: "로그인에 실패하였습니다." });
      }
    }
  };
}

module.exports = UserService;
