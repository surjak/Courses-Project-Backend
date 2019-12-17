const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");
router.post("/addCourse", isAuth, coursesController.addCourse);

module.exports = router;
