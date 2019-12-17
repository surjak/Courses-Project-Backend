const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
