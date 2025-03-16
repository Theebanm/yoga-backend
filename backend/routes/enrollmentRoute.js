const express = require("express");
const enrollmentController = require("../controller/enrollmentController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const enrollmentRoute = express.Router();

enrollmentRoute.get(
  "/enrolled-classes/:id",
  verifyToken,
  enrollmentController.enrolledClasses
);
enrollmentRoute.get("/popular-class", enrollmentController.popularClass);
enrollmentRoute.get(
  "/popular-instructor",
  enrollmentController.popularInstructor
);
enrollmentRoute.get(
  "/instructors",
  verifyToken,
  isAdmin,
  enrollmentController.AllInstructor
);

enrollmentRoute.get(
  "/admin-stats",
  verifyToken,
  isAdmin,
  enrollmentController.adminStats
);

module.exports = enrollmentRoute;
