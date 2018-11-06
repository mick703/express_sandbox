const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const myMiddleware = require("./middleware/my_middleware");
const config = require("config");
const normalDebugger = require("debug")("app:normal");
const dbDebugger = require("debug")("app:db");
const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to MongoDB.."))
  .catch(err => console.error("Could not connect to MongoDB.."));

app.use(express.json());
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}
app.use(myMiddleware);

normalDebugger(`App env is ${app.get("env")}`);
normalDebugger(`App name is ${config.get("name")}`);
normalDebugger(`Mail server is ${config.get("mail.host")}`);
normalDebugger(`Mail server password is ${config.get("mail.password")}`);
dbDebugger("Database debugging ");

app.use("/api/courses", courses);
app.use("/", home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
