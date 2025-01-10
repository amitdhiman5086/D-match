const mongoose = require("mongoose");
const { validate } = require("moongose/models/user_model");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Not Valid " + value);
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not Strong Password " + value);
        }
      },
    },
    phone: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Phone is Not Valid " + value);
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is Not Valid!!!");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is Not Valid!!!" + value);
        }
      },
    },
    about: {
      type: String,
      default: "Nothing In Provided By User",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
