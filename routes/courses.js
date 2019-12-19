const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");
router.post(
  "/addCourse",
  [
    body("ects").notEmpty(),
    body("name")
      .trim()
      .notEmpty(),
    body("semester")
      .trim()
      .notEmpty(),
    body("formOfCourse")
      .trim()
      .notEmpty(),
    body("imageURL")
      .trim()

      .notEmpty(),
    body("description")
      .trim()
      .notEmpty(),
    body("max")
      .trim()
      .notEmpty()
  ],
  isAuth,
  coursesController.addCourse
);
router.post(
  "/editCourse",
  [
    body("courseId").notEmpty(),
    body("ects").notEmpty(),
    body("name")
      .trim()
      .notEmpty(),
    body("semester")
      .trim()
      .notEmpty(),
    body("formOfCourse")
      .trim()
      .notEmpty(),
    body("imageURL")
      .trim()

      .notEmpty(),
    body("description")
      .trim()
      .notEmpty(),
    body("max")
      .trim()
      .notEmpty()
  ],
  isAuth,
  coursesController.editCourse
);
router.post("/delete", isAuth, coursesController.removeCourse);

router.post("/addCourseToUser", isAuth, coursesController.addCourseToUser);
router.post("/getUserCourseById", isAuth, coursesController.getUserCourseByID);
router.get("/getUserCourses", isAuth, coursesController.getUserCourses);
router.post("/rate", isAuth, coursesController.rateCourse);
router.get("/", isAuth, coursesController.getCourses);
module.exports = router;
