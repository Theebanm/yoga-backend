const express = require("express");
const classesController = require("../controller/ClassesController");
const verifyToken = require("../utils/verifyToken");
const isInstructor = require("../middleware/isInstructor");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../config/multer");

const classesRoute = express.Router();

classesRoute.post(
  "/new-class",
  verifyToken,
  isInstructor,
  classesController.newClass
);
classesRoute.put(
  "/class-image/:id",
  verifyToken,
  isInstructor,
  upload.single("image"),
  classesController.classImageUpload
);
classesRoute.get("/", verifyToken, isInstructor, classesController.allClasses);
classesRoute.get("/accepted", classesController.approvedClasses);
classesRoute.get("/:id", classesController.classDetails);
classesRoute.get("/:id", classesController.instructorCourses);
classesRoute.put(
  "/change-status/:id",
  verifyToken,
  isAdmin,
  classesController.updateStatus
);
classesRoute.put(
  "/:id",
  verifyToken,
  isInstructor,
  classesController.updateCourse
);
classesRoute.delete(
  "/:id",
  verifyToken,
  isAdmin,
  classesController.deleteCourse
);

module.exports = classesRoute;
