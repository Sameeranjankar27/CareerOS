const express = require("express");

const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create Job
router.post("/", protect, createJob);

// Get Job Statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const Job = require("../models/Job");

    const jobs = await Job.find({
      user: req.user._id,
    });

    const stats = {
      total: jobs.length,
      applied: jobs.filter((job) => job.status === "Applied").length,
      interview: jobs.filter((job) => job.status === "Interview").length,
      offer: jobs.filter((job) => job.status === "Offer").length,
      rejected: jobs.filter((job) => job.status === "Rejected").length,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get Stats Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get All Jobs
router.get("/", protect, getJobs);

// Update Job
router.put("/:id", protect, updateJob);

// Delete Job
router.delete("/:id", protect, deleteJob);

module.exports = router;