const express = require("express");
const connectDb = require("./config/dataBase.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter  = require("./routers/auth.js");
const profileRouter  = require("./routers/profile.js");
const  requestRouter  = require("./routers/request.js");
const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
