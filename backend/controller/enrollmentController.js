const asyncHandler = require("express-async-handler");
const Classes = require("../model/Classes");
const User = require("../model/User");
const EnrolledClass = require("../model/EnrolledClass");

const enrollmentController = {
  popularClass: asyncHandler(async (req, res) => {
    const result = await Classes.find().sort({ totalEnrollment: -1 }).limit(6);
    res.status(200).json(result);
  }),
  AllInstructor: asyncHandler(async (req, res) => {
    const topInstructors = await User.find({ access: "instructor" });
    res.status(200).json(topInstructors);
  }),
  popularInstructor: asyncHandler(async (req, res) => {
    const pipeline = [
      {
        $lookup: {
          from: "enrolledclasses",
          localField: "_id",
          foreignField: "instructorId",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          totalEnrollment: {
            $size: "$enrollments",
          },
        },
      },
      {
        $sort: {
          totalEnrollment: -1,
        },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          name: 1,
          email: 1,
          totalEnrollment: 1,
        },
      },
    ];

    const instructors = await User.aggregate(pipeline);
    res.status(200).json(instructors);
  }),

  // ! Admin Stats

  adminStats: asyncHandler(async (req, res) => {
    const result = await Promise.all([
      Classes.countDocuments({ status: "approved" }),
      Classes.countDocuments({ status: "pending" }),
      User.countDocuments({ roll: "instructor" }),
      Classes.countDocuments(),
      EnrolledClass.countDocuments(),
    ]);

    const [
      approvedClass,
      pendingClass,
      instructors,
      totalClasses,
      totalEnrollments,
    ] = result;

    res.status(200).json({
      approvedClass,
      pendingClass,
      instructors,
      totalClasses,
      totalEnrollments,
    });
  }),
  // ! Enrolled Classes

  enrolledClasses: asyncHandler(async (req, res) => {
    const enrolledClasses = await EnrolledClass.find({
      userId: req.params.id,
    }).populate("classId");
    res.status(200).json(enrolledClasses);
  }),
};

module.exports = enrollmentController;
