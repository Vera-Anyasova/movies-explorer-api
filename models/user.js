const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../utils/errors/unauthorized-error");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
  }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError("Неправильные почта или пароль");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
