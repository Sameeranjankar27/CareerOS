const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;