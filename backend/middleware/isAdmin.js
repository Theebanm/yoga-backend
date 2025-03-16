const User = require("../model/User");

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.roll !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - You are not an Admin",
    });
  }
  next();
};

module.exports = isAdmin;
