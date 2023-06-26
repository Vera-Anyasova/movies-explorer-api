const router = require("express").Router();
const {
  movieValidation,
  movieIdValidation,
} = require("../middlewares/validation");

const {
  getMovies,
  createMovie,
  deleteMovie,
  addLike,
  removeLike,
} = require("../controllers/movies");

router.get("/", getMovies);

router.post("/", movieValidation, createMovie);

router.put("/:_id/likes", movieIdValidation, addLike);

router.delete("/:_id/likes", movieIdValidation, removeLike);

router.delete("/:_id", movieIdValidation, deleteMovie);

module.exports = router;
