const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something Went Wrong in Profile Api");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Fields");
    }

    const loginedUser = req.user;

    Object.keys(req.body).forEach((key) => (loginedUser[key] = req.body[key]));

    await loginedUser.save();

    res.json({
      message: `${loginedUser.firstName} Your profile Updated Successfully`,
      data: loginedUser,
    });
  } catch (error) {
    res.status(400).send("ERROR in profile Edit API : " + error.message);
  }
});

module.exports = profileRouter;
