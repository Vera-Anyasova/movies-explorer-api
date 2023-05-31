const router = require("express").Router();
const users = require("./users");
const movies = require("./movies");
const auth = require("../middlewares/auth");
const { createUser, login, logout } = require("../controllers/users");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/not-found-error");

router.post("/signup", registerValidation, createUser);
router.post("/signin", loginValidation, login);
router.post("/signout", logout);

router.use("/users", auth, users);
router.use("/movies", auth, movies);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

module.exports = router;
