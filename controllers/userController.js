const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
// @route Post/ api/users/regiseter
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("all fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered!");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  const user = await User.create({ username, email, password: hashedPassword });
  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("user data not valied");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
// @route Post/ api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  console.log("iam hit login");
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are Mandatory");
  }
  const user = await User.findOne({ email });

  //compare password with hashedpassword
  console.log("iam hit compare password");
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status("401");
    throw new Error("email or password is not valied");
  }
});

//@desc Current user info
// @route GET/ api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  // res.json({ message: "current user" });
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
