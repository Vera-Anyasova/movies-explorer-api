const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const routes = require("./routes/index");
const handleErrors = require("./middlewares/handleErrors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { limiter } = require("./middlewares/limiter");
const allowedCors = require("./constants");

require("dotenv").config();
const { PORT, MONGODB_URI } = require("./config");

const app = express();
app.use(helmet());
app.use(limiter);

app.options(
  "*",
  cors({
    origin: allowedCors,
    credentials: true,
  })
);

app.use(
  cors({
    origin: allowedCors,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
