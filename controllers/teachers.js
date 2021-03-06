const { validationResult } = require("express-validator");
const User = require("../models/user");
const Teacher = require("../models/teacher");

const Course = require("../models/course");

exports.addTeacher = (req, res, next) => {
  console.log(req.body);
  console.log(req.admin);
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
  const { name, email, surname, imageUrl, telephone, page } = req.body;
  const teacher = new Teacher({
    name: name,
    mail: email,
    surname: surname,
    imageUrl: imageUrl,
    telephone: telephone,
    personalPage: page
  });
  teacher
    .save()
    .then(result => {
      res.status(201).json({
        message: "Teacher Created",
        _id: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTeachers = (req, res, next) => {
  Teacher.find()
    // .populate("learningSkills")
    // .populate("personalSkills")
    // .populate("softSkills")
    .then(result => {
      console.log(result);

      res.status(200).json({
        teachers: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.removeTeacher = (req, res, next) => {
  if (!req.admin) {
    const error = new Error("No permission!");
    error.statusCode = 422;
    throw error;
  }
  const teacherId = req.body.teacherId;
  Teacher.findByIdAndRemove(teacherId)
    .then(result => {
      console.log(result);
      Course.find({}, (err, courses) => {
        courses.map(course => {
          const id = course.teachers.indexOf(teacherId);
          course.teachers.splice(id, 1);
          course.save();
        });
      });
      res.json({ message: "Deleted" });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addCommentToTeacher = (req, res, next) => {
  const { type, comment, teacherId } = req.body;
  if (type == "Learning Skills") {
    Teacher.findById(teacherId, (err, teacher) => {
      teacher.learningSkills.push({
        userId: req.userId,
        email: req.email,
        comment: comment
      });
      teacher.save();
      res.json("OK");
    });
  } else if (type == "Soft Skills") {
    Teacher.findById(teacherId, (err, teacher) => {
      teacher.softSkills.push({
        userId: req.userId,
        email: req.email,
        comment: comment
      });
      teacher.save();
      res.json("OK");
    });
  } else {
    Teacher.findById(teacherId, (err, teacher) => {
      teacher.personalSkills.push({
        userId: req.userId,
        email: req.email,
        comment: comment
      });
      teacher.save();
      res.json("OK");
    });
  }
};
