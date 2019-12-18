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

exports.getCourses = (req, res, next) => {
  console.log("hel");

  const responseData = [];
  Course.find()
    .populate("teachers")
    .populate("attendees")
    .populate("comments")
    .exec()
    .then(result => {
      result.forEach(course => {
        let grade = 0;
        if (course.countOfNotes != 0) {
          grade = course.sumOfNotes / course.countOfNotes;
        }
        responseData.push({
          _id: course._id,
          name: course.name,
          ects: +course.ects,
          semester: +course.semester,
          formOfCourse: course.formOfCourse,
          grade: grade,
          imageUrl: course.imageURL,
          description: course.description,
          tutors: course.teachers,
          max: course.max,
          comments: course.comments,
          attendees: course.attendees.length
        });
      });
      res.json({ data: responseData });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.removeCourse = (req, res, next) => {
  if (!req.admin) {
    const error = new Error("No permission!");
    error.statusCode = 422;
    throw error;
  }
  const courseID = req.body.courseID;
  Course.findByIdAndRemove(courseID)
    .then(result => {
      console.log(result);

      res.json({ message: "Deleted" });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editCourse = (req, res, next) => {
  console.log("edit");

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
    courseId,
    name,
    ects,
    semester,
    formOfCourse,
    imageURL,
    teachers,
    description,
    max
  } = req.body;
  Course.findByIdAndUpdate(courseId, {
    name: name,
    ects: ects,
    semester: semester,
    formOfCourse: formOfCourse,
    imageUrl: imageURL,
    description: description,
    max: max,
    teachers: teachers
  })
    .then(result => {
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
