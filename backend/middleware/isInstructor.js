const User = require("../model/User");

const isInstructor = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.roll !== "instructor") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - You are not an Instructor",
    });
  }
  next();
};

module.exports = isInstructor;
