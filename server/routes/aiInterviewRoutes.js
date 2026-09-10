const express = require("express");

const {
  generateInterviewPrep,
} = require("../controllers/aiInterviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateInterviewPrep
);

module.exports = router;