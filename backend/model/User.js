const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  about: {
    type: String,
  },
  phone: {
    type: String,
  },
  skills: {
    type: String,
    default: null,
  },
  roll: {
    type: String,
    enum: ["user", "instructor", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
