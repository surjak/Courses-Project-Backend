const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  console.log("hej");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const adminPassword = req.body.admin;
  let admin = false;
  if (adminPassword == "ala123") {
    admin = true;
  }
  if (adminPassword != null && adminPassword != "ala123") {
    const error2 = new Error("Invalid password");
    error2.statusCode = 422;
    throw error2;
  }
  const tutor = req.body.tutor;
  bcrypt
    .hash(password, 12)
    .then(hashpass => {
      const user = new User({
        email: email,
        password: hashpass,
        admin: admin,
        tutor: tutor
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "User Created",
        userId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error("Can't find user ");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEql => {
      if (!isEql) {
        const error = new Error(" Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        "qwertyuiop1234567890asdfghjkl",
        { expiresIn: "1h" } //ile token bedzie wazny
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        admin: loadedUser.admin,
        tutor: loadedUser.tutor,
        email: loadedUser.email,
        expiresIn: 60 * 60 * 10
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
