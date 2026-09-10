const express = require("express");

const {
  analyzeResumeAgainstJob,
} = require("../controllers/aiAnalysisController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/resume-vs-job",
  protect,
  analyzeResumeAgainstJob
);

module.exports = router;