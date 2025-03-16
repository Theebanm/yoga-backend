const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Provide token",
    });
  }
  await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
