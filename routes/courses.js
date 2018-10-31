const express = require("express");
const Joi = require("joi");

const router = express.Router();

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" }
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const newCourse = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(newCourse);
  return res.status(201).send(newCourse);
});

router.put("/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Not found");

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  course.name = req.body.name;
  return res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Not found");
  courses.splice(courses.indexOf(course), 1);
  return res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return ({ error, value } = Joi.validate(course, schema));
}

module.exports = router;
