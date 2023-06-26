const Movie = require("../models/movie");
const NotFoundError = require("../utils/errors/not-found-error");
const ForbiddenError = require("../utils/errors/forbidden-error");

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
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

const updateDataCard = (req, res, updateData, next) => {
  Movie.findByIdAndUpdate(req.params._id, updateData, { new: true })
    .populate(["owner", "likes"])
    .then((movie) => {
      if (movie) {
        res.send(movie);
      } else {
        throw new NotFoundError("Фильм не найден");
      }
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  updateDataCard(req, res, updateData, next);
};

module.exports.removeLike = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  updateDataCard(req, res, updateData, next);
};
