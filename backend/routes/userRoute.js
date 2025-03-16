const express = require("express");
const userController = require("../controller/userController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../config/multer");

const userRoute = express.Router();

userRoute.post("/register", userController.register);
userRoute.post("/login", userController.login);
userRoute.get("/logout", verifyToken, userController.logout);

// ! CRUD Routes
userRoute.get("/:id", verifyToken, userController.getUser);
userRoute.get("/", verifyToken, isAdmin, userController.getUsers);
userRoute.put("/:id", verifyToken, userController.updateUser);
userRoute.delete("/:id", verifyToken, isAdmin, userController.deleteUser);
// ! Profile Upload
userRoute.put(
  "/profile-upload/:id",
  verifyToken,
  upload.single("image"),
  userController.uploadProfile
);

module.exports = userRoute;
