const { validationResult } = require("express-validator");
const User = require("../models/user");
const Teacher = require("../models/teacher");
const Course = require("../models/course");
exports.addCourse = (req, res, next) => {
  const errors = validationResult(req);
  if (!req.admin) {
    const error = new Error("No permission!");
    error.statusCode = 422;
    throw error;
  }
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {
    name,
    ects,
    semester,
    formOfCourse,
    imageURL,
    teachers,
    description,
    max
  } = req.body;
  const course = new Course({
    name: name,
    ects: ects,
    semester: semester,
    formOfCourse: formOfCourse,
    imageURL: imageURL,
    description: description,
    max: max,
    countOfNotes: 0,
    sumOfNotes: 0,
    teachers: teachers
  });
  course
    .save()
    .then(result => {
      //   result
      //     .populate("teachers")
      //     .execPopulate()
      //     .then(value => console.log(value));

      res.json({
        courseID: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
