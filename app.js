const express = require("express");
const mongoose = require("mongoose");

const houseRoutes = require("./routes/house");
const Requests = require("./routes/requests");
const feedback = require("./routes/feedback");
const userRoutes = require("./routes/userRoutes");
const note = require("./routes/notification");

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://0.0.0.0:27017/Haylegnaw")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

app.use("/house", houseRoutes);
app.use("/request", Requests);
app.use("/user", userRoutes);
app.use("/note", note);
app.use("/feed", feedback);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
