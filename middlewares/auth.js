const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/errors/unauthorized-error");
const { NODE_ENV, JWT_SECRET } = require("../config");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "jwt-secret"
    );
  } catch (err) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  req.user = { _id: payload._id };

  next();
};
