const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const myMiddleware = require("./middleware/my_middleware");
const config = require("config");

const app = express();

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" }
];

app.use(express.json());
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(myMiddleware);

console.log(`App env is ${app.get("env")}`);
console.log(`App name is ${config.get("name")}`);
console.log(`Mail server is ${config.get("mail.host")}`);
console.log(`Mail server password is ${config.get("mail.password")}`);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
});

app.post("/api/courses", (req, res) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const { error, value } = Joi.validate(req.body, schema);
  console.log(error);
  if (error) {
    res.status(400).send(error);
    return;
  }

  const newCourse = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(newCourse);
  res.send(newCourse);
  return;
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
