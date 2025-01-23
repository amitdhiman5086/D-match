const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");
const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    //Validating the req.body
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, 8);

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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("LogOut Success ")
});

module.exports = authRouter;
