const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");
const UserModel = require("../models/userSchema.js");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:requestStatus/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const requestStatus = req.params.requestStatus;

      const allowedMethods = ["ignore", "interested"];
      if (!allowedMethods.includes(requestStatus)) {
        return res.status(400).json({
          message: "Invalid Status Code : " + requestStatus,
        });
      }

      const toUser = await UserModel.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({
          message: "User Not Found !",
        });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request is Already Existis",
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        requestStatus,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + requestStatus + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

module.exports = requestRouter;
