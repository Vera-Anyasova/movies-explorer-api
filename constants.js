const regex =
  /(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w\\.-]*[\w.,@?^=%&:\\/~+#-])*\/?/;

const allowedCors = [
  "https://localhost:3000",
  "http://localhost:3000",
  "https://51.250.88.144",
  "http://51.250.88.144",
];

const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_FORBIDDEN = 403;
const STATUS_NOT_FOUND = 404;
const STATUS_CONFLICT = 409;
const STATUS_INTERNAL_SERVER_ERROR = 500;

module.exports = {
  regex,
  allowedCors,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
};
