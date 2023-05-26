const asyncHandler = require("express-async-handler");
const Contact = require("../models/userModel");
//@desc Register a user
// @route Post/ api/users/regiseter
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, passowrd } = req.body;
  if (!username || !email || passowrd) {
    res.status(400);
    throw new Error("all fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvaiable) {
    res.status(400);
    throw new Error("user already registered!");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
// @route Post/ api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "login user" });
});

//@desc Current user info
// @route GET/ api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "current user" });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
