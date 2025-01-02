const express = require("express");
const connectDb = require("./config/dataBase.js");
const UserModel = require("./models/userSchema.js");
const app = express();

app.post("/signUp", async (req, res) => {
  const userObject = {
    firstName: "test",
    lastName: "kumar",
    password: "test@1232",
    email: "test@gmail.com",
    age: "12",
  };

  try {
    const user = new UserModel(userObject);
    const data = await user.save();
    res.send(data);
  } catch (error) {
    res
      .status(400)
      .send("Error message while Saving The User :" + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database is Connected...");

    app.listen(3000, () => {
      console.log("Server is listening on port");
    });
  })
  .catch((err) => {
    console.log("Error While Connecting to the Database" + err);
  });
