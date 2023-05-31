const Movie = require("../models/movie");
const NotFoundError = require("../utils/errors/not-found-error");
const ForbiddenError = require("../utils/errors/forbidden-error");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate("owner")
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .then((movie) => movie.populate("owner"))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params._id })
    .orFail(() => {
      throw new NotFoundError("Фильм не найден");
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError("Нет прав доступа");
      }
      return Movie.deleteOne(movie).then(() => res.send(movie));
    })
    .catch(next);
};
