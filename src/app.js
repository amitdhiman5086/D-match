const express = require("express");
const connectDb = require("./config/dataBase.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");
const userRouter = require("./routers/user.js");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from React app
    credentials: true, // Allow cookies/auth
  })
);
dotenv.config();

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

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
