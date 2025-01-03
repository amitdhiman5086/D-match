const express = require("express");
const connectDb = require("./config/dataBase.js");
const UserModel = require("./models/userSchema.js");
const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await UserModel.find({ email: emailId });
    if (user.length === 0) {
      res.status(404).send("User Not Found With This Email Id");
    } else {
      res.send(user);
    }
  } catch (error) {
    res
      .status(400)
      .send("Something went Wrong While Fetching By The Email........");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    const totalUser = allUsers.length;

    res.json({
      users: allUsers,
      totalUser: totalUser,
    });
  } catch (error) {
    res.status(400).send("Something Went Wrong in The Feed Api Section");
  }
});

//Delete Api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = await UserModel.findByIdAndDelete(userId);
    if (data === null) {
      res.status(404).send("User Doesn't Exists in DB ");
    } else {
      res.send("User Deleted Successfully");
    }
  } catch (error) {
    res.status(400).send("Something Went Wrong In Delete api");
  }
});

//Update Api +> Diff. Between Patch and Put
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    if (updatedUser === null) {
      res.status(404).send("User Not Exists");
    }
    res.send("User is Updated");
  } catch (error) {
    res.status(400).send("Something Went Wrong In Update Api");
  }
});

//Update User By Email 
app.patch("/userbymail", async (req, res) => {
  // const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      data,
      {
        returnDocument: "after",
      }
    );
    if (updatedUser === null) {
      res.status(404).send("User Not Exists");
    }
    res.send("User is Updated");
  } catch (error) {
    res.status(400).send("Something Went Wrong In Update Api");
  }
});

app.post("/signUp", async (req, res) => {
  const userObject = req.body;

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
