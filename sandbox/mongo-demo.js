const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost/mongo-exercises",
    { useNewUrlParser: true }
  )

  .then(() => console.log("Connected to MongoDB...."))
  .catch(err => console.error("Could not connect to MongoDB ...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

//Class Course
const Course = mongoose.model("Course", courseSchema);
// const course = new Course({
//   name: "Angular Course",
//   author: "Peter",
//   tags: ["angular", "frontend"],
//   isPublished: true
// });

// async function createCourse() {
//   const result = await course.save();
//   console.log(result);
// }
// // createCourse();

async function getCourses() {
  //eq (equal)
  //ne (not equal)
  //gt (greater than)
  //gte (greater than or equal to)
  //lt (less than)
  //let (letss than or equal to)
  //in
  //nin (not in)

  const pageNumber = 3;
  const pageSize = 10;
  const courses = await Course.find();
  // .find({ price: {$gt: 10, $lte: 20} }) //>10 and <=20
  // // .find({ price: { $in: [10, 15, 20] } }) // 10, 15, 20
  // .find()
  // .or([{ author: "Tom" }, { isPublished: true }]) //OR
  // .and([{ author: "Tom" }, { isPublished: true }]) //AND
  // .find({ author: /^Tom/ }) //Regex starting with
  // .find({ author: /Tom$/i }) //Regex ending with, case incensitive
  // .find({ author: /.*Tom.*/ }) //Containing
  // .skip((pageNumber - 1) * pageSize) //Pagination
  // .limit(pageSize) //Pagination
  // .sort({ name: 1 }) //-1: DESC 1: ASC
  // .select({ name: 1, tags: 1 })
  // .countDocuments(); //Return the total count
  console.log(courses);
}

//getCourses();

//Update document
async function updateCourse(id) {
  const course = await Course.findOne({ _id: mongoose.Types.ObjectId(id) });
  console.log(course);
  // if (!course) {
  //   console.log(id);
  //   return;
  // }

  // course.isPublished = true;
  // course.author = "New Author";

  // const result = await course.save();
  // console.log(result);
}

updateCourse("5a68fdf95db93f6477053ddd");
