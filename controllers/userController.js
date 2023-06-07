const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const apiError = require("../error/apiError");
const { User } = require("../models/models");

const generateJwt = (id, email, role, username, phone) => {
  return jwt.sign(
    {
      id,
      email,
      role,
      username,
      phone,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class userController {
  async registration(req, res, next) {
    try {
      const { email, password, role, username, phone } = req.body;

      if (!email || !password || !username || !phone) {
        return next(apiError.badRequest("Ошибка валидации"));
      }

      const candidate = await User.findOne({ where: { email } });

      if (candidate) {
        return next(
          apiError.badRequest("Пользователь с таким email уже существует!")
        );
      }

      let hashPassowrd = bcrypt.hashSync(password, 5);

      const user = await User.create({
        email,
        role,
        username,
        password: hashPassowrd,
        phone,
      });

      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.username,
        user.phone
      );

      return res.json({
        token,
      });
    } catch (error) {
      next(apiError.badRequest(error.message));
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(apiError.internal("Такой пользователь не найден"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(apiError.internal("Неверный email или пароль"));
    }

    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.username,
      user.phone
    );

    return res.json({ token });
  }

  async findUsers(req, res) {
    const users = await User.findAll({
      where: {
        role: "USER",
      },
    });

    return res.json({ users });
  }

  async findMasters(req, res) {
    const users = await User.findAll({
      where: {
        role: "MASTER",
      },
    });

    return res.json({ users });
  }
  async findAllUsers(req, res) {
    const users = await User.findAll({
      where: {
        role: {
          [Op.not]: "ADMIN",
        },
      },
    });

    return res.json({ users });
  }

  async changeRole(req, res) {
    const { id, role } = req.body;

    const users = await User.update(
      { role },
      {
        where: {
          id,
        },
      }
    );

    return res.json({ users });
  }

  async editUser(req, res) {
    try {
      const { phone, email, id } = req.body;

      const user = await User.update(
        { phone, email },
        {
          where: {
            id,
          },
        }
      );

      return res.json({ user });
    } catch (e) {
      console.log(e);
    }
  }

  async check(req, res) {
    const user = await User.findOne({ where: { id: req.user.id } });

    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.username,
      user.phone
    );

    return res.json(token);
  }
}

module.exports = new userController();
