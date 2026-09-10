const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token doesn't exist
    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid token.",
    });
  }
};

module.exports = protect;