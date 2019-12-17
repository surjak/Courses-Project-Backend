const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: false
  },
  personalPage: {
    type: String,
    required: false
  },
  learningSkills: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  personalSkills: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  softSkills: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
});

module.exports = mongoose.model("Teacher", teacherSchema);
