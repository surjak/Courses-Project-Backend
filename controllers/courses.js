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
    .populate("comments.userId")
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

  User.find({}, (err, users) => {
    users.map(user => {
      user.coursesAndNotes = user.coursesAndNotes.filter(
        c => c.courseId != courseID
      );
      user.save();
    });
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
    imageURL: imageURL,
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

exports.addCourseToUser = (req, res, next) => {
  Course.findById(req.body.courseId)
    .then(course => {
      if (course.attendees.length < course.max) {
        course.attendees.push(req.userId);
        course.save();
      } else {
        const error = new Error("There aren't free places");
        error.statusCode = 422;
        throw error;
      }

      User.findById(req.userId)
        .then(result => {
          result.coursesAndNotes.forEach(c => {
            if (c.courseId == req.body.courseId) {
              const error = new Error(
                "You can't join this course another time"
              );
              error.statusCode = 422;
              throw error;
            }
          });
          result.coursesAndNotes.push({
            courseId: req.body.courseId,
            note: null
          });
          result.save();
          res.json({ message: "isOk" });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getUserCourses = (req, res, next) => {
  User.findById(req.userId)
    .populate("coursesAndNotes.courseId")
    .exec()
    .then(data => {
      return data.coursesAndNotes;
    })
    .then(data => {
      console.log(data);
      res.json({ data: data });
    })

    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserCourseByID = (req, res, next) => {
  console.log("getByID");

  User.findById(req.userId)
    .populate("coursesAndNotes.courseId")
    .exec()
    .then(data => {
      return data.coursesAndNotes;
    })
    .then(data => {
      data.forEach(c => {
        if (c.courseId._id == req.body.c_id) {
          res.json({ data: c });
          return;
        }
      });
    })

    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.rateCourse = (req, res, next) => {
  console.log("elo");

  let oldRate = null;
  User.findById(req.userId)
    .then(user => {
      user.coursesAndNotes.forEach(course => {
        if (course.courseId == req.body.courseId) {
          oldRate = course.note;
          course.note = req.body.rate;
        }
      });
      user.save();

      Course.findById(req.body.courseId)
        .then(course => {
          if (oldRate != null) {
            course.sumOfNotes = course.sumOfNotes - oldRate + req.body.rate;
          } else {
            course.sumOfNotes += req.body.rate;
            course.countOfNotes += 1;
          }
          course.save();
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
      res.json("updated");
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.addComment = (req, res, next) => {
  console.log("comment");
  console.log(req.body, req.userId);

  User.findById(req.userId, (err, user) => {
    user.comments.push({
      courseId: req.body.courseId,
      comment: req.body.comment
    });
    user.save();
    Course.findById(req.body.courseId, (err, course) => {
      course.comments.push({
        userId: req.userId,
        comment: req.body.comment,
        email: req.email
      });
      course.save();
      res.json({ message: "ok" });
    });
  });
};
