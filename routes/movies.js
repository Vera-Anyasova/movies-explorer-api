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

router.put("/:movieId/likes", movieIdValidation, addLike);

router.delete("/:movieId/likes", movieIdValidation, removeLike);

router.delete("/:_id", movieIdValidation, deleteMovie);

module.exports = router;
