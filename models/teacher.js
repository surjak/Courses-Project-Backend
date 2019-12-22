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
  learningSkills: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
      comment: {
        type: String
      }
    }
  ],
  personalSkills: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
      comment: {
        type: String
      }
    }
  ],
  softSkills: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
      comment: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model("Teacher", teacherSchema);
