const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useFindAndModify", false);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");
const courseRoutes = require("./routes/courses");

app.use("/auth", authRoutes);
app.use("/teachers", teacherRoutes);
app.use("/courses", courseRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb://localhost/CoursesProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    app.listen(8080, () => {
      console.log("Listening on 8080");
    });
  })
  .catch(err => console.log(err));
