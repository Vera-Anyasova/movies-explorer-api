const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = require("../config");
const NotFoundError = require("../utils/errors/not-found-error");
const ConflictError = require("../utils/errors/conflict-error");
const BadRequestError = require("../utils/errors/bad-request-error");

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Указанный email уже существует"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Произошла ошибка валидации"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "jwt-secret",
        {
          expiresIn: "7d",
        }
      );

      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.send({ _id: user._id });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError("Нет пользователя с таким id");
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    { _id: userId },
    { email: req.body.email, name: req.body.name },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError("Нет пользователя с таким id");
      }
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: true,
  });
  res.send({ message: "Успешный выход" });
};
