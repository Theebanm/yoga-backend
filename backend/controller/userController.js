const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const generateToken = require("../utils/generateToken");

const userController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    user.save();
    res.json(user);
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.status(400);
      throw new Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userFound.password
    );
    if (!isPasswordCorrect) {
      res.status(400);
      throw new Error("Incorrect password");
    }

    const token = generateToken(userFound._id);

    res.status(200).json({ token, userFound });
  }),
  logout: asyncHandler(async (req, res) => {
    req.user = null;
    res.status(200).json({ message: "User logged out successfully" });
  }),

  // ! CRUD Operations For User
  getUsers: asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  }),
  getUser: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const users = await User.findById(id).select("-password");
    res.status(200).json(users);
  }),
  updateUser: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    const userFound = await User.findById(id);
    if (!userFound) {
      throw new Error("User not Found");
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userFound = await User.findById(id);
    if (!userFound) {
      throw new Error("User not found.");
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User Deleted Successfully" });
  }),

  // ! Profile Uploads
  uploadProfile: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const image = req.file.path;
    const userFound = await User.findById(id);
    if (!userFound) {
      throw new Error("User not found.");
    }
    await User.findByIdAndUpdate(
      id,
      { image },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "Profile updated successfully",
      imageUrl: req.file.path,
    });
  }),
};

module.exports = userController;
