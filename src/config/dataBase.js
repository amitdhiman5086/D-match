const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://amitdhiman5086:8MTOBl1mUSV9IYA7@cluster0.vzohn.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
