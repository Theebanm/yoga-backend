const asyncHandler = require("express-async-handler");
const Classes = require("../model/Classes");
const User = require("../model/User");
const classesController = {
  // ? create new class
  newClass: asyncHandler(async (req, res) => {
    const {
      name,
      description,
      image,
      video,
      duration,
      instructor,
      price,
      totalSeats,
    } = req.body;
    if (
      !name ||
      !description ||
      !image ||
      !video ||
      !duration ||
      !instructor ||
      !price ||
      !totalSeats
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const newClass = await Classes.create({
      name,
      description,
      image,
      video,
      duration,
      price,
      totalSeats,
      instructor,
    });

    newClass.save();
    res.status(201).json({
      message: "Class Created Successfully",
      newClass,
    });
  }),
  // ? All classes registered by tutors
  allClasses: asyncHandler(async (req, res) => {
    const classes = await Classes.find({});
    if (!classes) {
      res.status(400);
      throw new Error("No classes Avaailable");
    }
    res.status(200).json(classes);
  }),
  // ? list of approved classes by admin
  approvedClasses: asyncHandler(async (req, res) => {
    const classes = await Classes.find({ status: "approved" });
    if (!classes) {
      res.status(404);
      throw new Error("No classes available");
    }
    res.status(200).json(classes);
  }),
  // ? Show all details of class
  classDetails: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Classes.findById(id);
    res.status(200).json(course);
  }),
  // ? Filter classes based on instructor
  instructorCourses: asyncHandler(async (req, res) => {
    const id = req.params.id;

    const courses = await Classes.find({ instructor: id });
    if (!courses) {
      res.status(404);
      throw new Error("No classes available");
    }
    res.status(200).json(courses);
  }),
  // ? update the status of class
  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    const updatedCourse = await Classes.findByIdAndUpdate(
      id,
      { status, reason },
      { new: true, runValidators: true }
    );
    if (!updatedCourse) {
      res.status(404);
      throw new Error(" Class not found");
    }
    res.status(200).json({
      message: "Class updated successfully",
      updatedCourse,
    });
  }),
  // ?Update the details of Course
  updateCourse: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    const courseFound = await Classes.findById(id);
    if (!courseFound) {
      throw new Error("Course not Found");
    }
    const updatedClass = await Classes.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Class status updated successfully",
      updatedClass,
    });
  }),
  // ? Delete Course
  deleteCourse: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const courseFound = await Classes.findById(id);
    if (!courseFound) {
      throw new Error("Class not found.");
    }
    await Classes.findByIdAndDelete(id);
    res.status(200).json({ message: "Class Deleted Successfully" });
  }),
  classImageUpload: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const image = req.file.path;
    const courseFound = await Classes.findById(id);
    if (!courseFound) {
      throw new Error("Class not found.");
    }
    await Classes.findByIdAndUpdate(
      id,
      { image },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "Class Image updated successfully",
      imageUrl: req.file.path,
    });
  }),
};

module.exports = classesController;
