const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/mongo-exercises",
  { useNewUrlParser: true }
);
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

const newCourse = new Course({
  name: "CAD Design",
  tags: ["Design"],
  author: "John Peter    ",
  isPublished: false,
  price: 15.88
});

newCourse
  .save()
  .then(result => console.log(result))
  .catch(err => {
    for (field in err.errors) {
      console.log(err.errors[field].message);
    }
  });

return;

// Course.find({ isPublished: true, tags: { $in: ["backend"] } })
//   .select({ name: 1, author: 1 }) // .select(["name", "author"])
//   .sort({ name: 1 }) //.sort('name') ASC .sort('-name') DESC
//   .then(result => console.log(result));

// Course.find({ isPublished: true, tags: { $in: ["backend", "frontend"] } })
//   .select(["name", "author", "price"]) //
//   .sort("-price")
//   .then(result => console.log(result));

// Course.find()
//   .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
//   .and({ isPublished: true })
//   .select(["name", "author", "price", "isPublished"]) //
//   .sort("-price")
//   .then(result => console.log(result));

// Course.findById("5be02cb32ceb2751010d217c", function(err, doc) {
//   console.log(doc);
// });

async function updateCourse(id, newInfo) {
  let course = await Course.findById(id);
  course.set(newInfo);

  const result = await course.save();

  console.log("Course updated ", result);
}

// updateCourse("5a68fdf95db93f6477053ddd", {
//   name: "Redux Course",
//   author: "Ming",
//   isPublished: true,
//   price: 20,
//   tags: ["redux", "javascript", "frontend"]
// });

Course.updateOne(
  { _id: "5a68fdf95db93f6477053ddd" },
  {
    isPublished: false,
    author: "John",
    price: 50
  }
).then(result => console.log("Direct update. ", result));

// Course.findOne({ author: "Mary" }).then(course => {
//   if (!course) {
//     console.log("course not found", course);
//     return;
//   }
//   console.log(course);
//   course.author = "Ann";
//   course.isPublished = true;
//   course.save().then(result => {
//     console.log("Updated. ", result);
//   });
//   // return course
//   //   .set({
//   //     name: "New course name",
//   //     author: "New author",
//   //     price: 30,
//   //     isPublished: false
//   //   })
//   //   .save();
// });
// // .then(result => {
// //   console.log("Course saved: ", result);
// // });

//Delete a doc
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}

removeCourse("5a68fdf95db93f6477053ddd");
