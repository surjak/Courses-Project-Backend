const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ects: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  formOfCourse: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  countOfNotes: {
    type: Number,
    required: true
  },
  sumOfNotes: {
    type: Number,
    required: true
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher" }]
});

module.exports = mongoose.model("Course", courseSchema);
