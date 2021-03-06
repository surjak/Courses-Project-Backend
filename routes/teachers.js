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

      .notEmpty(),
    body("page")
      .trim()

      .notEmpty()
  ],
  isAuth,
  teachersController.addTeacher
);
router.post("/remove", isAuth, teachersController.removeTeacher);
router.post("/addComment", isAuth, teachersController.addCommentToTeacher);
router.get("/", isAuth, teachersController.getTeachers);

module.exports = router;
