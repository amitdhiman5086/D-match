const express = require("express");
const connectDb = require("./config/dataBase.js");
const UserModel = require("./models/userSchema.js");
const { validateSignUpData } = require("./utils/validation.js");
const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { userAuth } = require("./middleware/auth.js");
app.use(express.json());
app.use(cookieParser());
dotenv.config();

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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["photoURL", "about", "password", "skills"];
    const isAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );
    if (!isAllowed) {
      throw new Error("Invalid Updates");
    }

    if (data?.skills && (data?.skills.length > 10 || data?.skills.length < 0)) {
      throw new Error("Skills Should be less than 10");
    }

    if (data?.password && data?.password.length < 8) {
      throw new Error("Password Should be Greater than 8");
    }

    if (data?.about && data?.about.length > 100) {
      throw new Error("About Should be Less than 100");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (updatedUser === null) {
      res.status(404).send("User Not Exists");
    }
    res.send("User is Updated");
  } catch (error) {
    res
      .status(400)
      .send("Something Went Wrong In Update Api by ID   :-" + error.message);
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
        runValidators: true,
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
  try {
    //Validating the req.body
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, 8, () => {
      // console.log("Password Hashed");
    });

    // console.log(passwordHash);

    const user = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
    });
    const data = await user.save();
    res.send(data);
  } catch (error) {
    res
      .status(400)
      .send("Error message while Saving The User :" + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && validator.isEmail(email))) {
    return res.status(400).send("Email is Not Valid");
  }

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(404).send("Invalid Credential");
  }
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    return res.status(400).send("Invalid Credential");
  }

  const token = await user.getJWT();

  res.cookie("token", token, { expires: new Date(Date.now() + 720 * 3600000) });
  res.send("User is Authenticated");
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something Went Wrong in Profile Api");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res, next) => {
  const user = req.user;
  const name = user?.firstName;
  console.log("Sending  Request");

  res.send("Request Send " + name);
});

connectDb()
  .then(() => {
    console.log("Database is Connected...");

    app.listen(3000, () => {
      console.log("Server is listening on port");
    });
  })
  .catch((err) => {
    console.log("Error While Connecting to " + err);
  });
