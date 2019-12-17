const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachers");
const { body } = require("express-validator");
const Teacher = require("../models/teacher");
const isAuth = require("../middlewares/is-auth");

router.post(
  "/new",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter Email")
      .normalizeEmail(),
    body("name")
      .trim()
      .notEmpty(),
    body("surname")
      .trim()
      .notEmpty(),
    body("telephone")
      .isMobilePhone()
      .withMessage("Please enter MobilePhone")
      .trim()
      .notEmpty(),
    body("imageUrl")
      .trim()
      .isURL()
      .withMessage("Please enter URL")
      .notEmpty(),
    body("page")
      .trim()
      .isURL()
      .withMessage("Please enter URL")
      .notEmpty()
  ],
  isAuth,
  teachersController.addTeacher
);
router.post("/remove", isAuth, teachersController.removeTeacher);
router.get("/", isAuth, teachersController.getTeachers);

module.exports = router;
