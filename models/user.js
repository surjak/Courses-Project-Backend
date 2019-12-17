const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  tutor: {
    type: Boolean,
    required: true,
    default: false
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  coursesAndNotes: [
    {
      courseId: { type: Schema.Types.ObjectId, ref: "Course" },
      note: { type: Number }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
