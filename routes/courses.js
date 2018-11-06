const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");

const router = express.Router();

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "A course should have at least one tag"
    }
  },
  author: {
    type: String,
    validate: {
      isAsync: true,
      validator: function(v, cb) {
        setTimeout(() => {
          if (v.length > 4) return cb(true);
          return cb(false);
        }, 2000);
      },
      message: "Author name must be longer than 4 characters."
    },
    trim: true
  },
  date: { type: String, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    min: 1,
    max: 20,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

const Course = mongoose.model("Course", courseSchema);

router.get("/", async (req, res) => {
  return res.send(await Course.find().sort("name"));
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) {
      return res.status(404).send("Not found");
    }
    return res.status(200).send(course);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  let newCourse = new Course(req.body);
  try {
    newCourse = await newCourse.save();
    return res.status(201).send(newCourse);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let course = await Course.findOne({ _id: req.params.id });
    if (!course) return res.status(404).send("Not found");
    const { error } = validateCourse(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    console.log(course);

    // for (field in req.body) {
    //   course[field] = req.body[field];
    // }
    course.set(req.body);

    return res.send(await course.save());
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Course.deleteOne({ _id: req.params.id });
    if (result.n === 0) {
      return res.status(404).send("Not found");
    }
    return res.send("OK");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

function validateCourse(course) {
  // const schema = {
  //   name: Joi.string()
  //     .min(3)
  //     .required()
  // };

  // return ({ error, value } = Joi.validate(course, schema));
  return true;
}

module.exports = router;
