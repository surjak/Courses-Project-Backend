const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachers");
const { body } = require("express-validator");
const Teacher = require("../models/teacher");
const isAuth = require("../middlewares/is-auth");

router.post("/new", isAuth, teachersController.addTeacher);
router.get("/", isAuth, teachersController.getTeachers);

module.exports = router;
