const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is Not Valid" + email);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
