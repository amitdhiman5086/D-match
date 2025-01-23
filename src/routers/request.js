const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res, next) => {
    const user = req.user;
    const name = user?.firstName;
    console.log("Sending  Request");
  
    res.send("Request Send " + name);
  });
  

module.exports = requestRouter;
